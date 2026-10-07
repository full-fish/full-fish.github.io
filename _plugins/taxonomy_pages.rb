# frozen_string_literal: true

require "cgi"
require "json"
require "set"

# 빌드할 때 블로그 분류 페이지를 만듭니다.
#   /categories/<부모>/[<자식>/]  글의 categories: [부모, 자식] "경로" 기준 (이름이 같은 자식끼리 섞이지 않음)
#   /tags/<태그>/
#   site.data["category_nav"]  사이드바 트리. 순서는 _data/category_tree.yml, 글이 없는 카테고리는 빠짐
#   site.data["tag_index"]     태그 목록 (글 많은 순)
#   예전 글 주소(_data/legacy_urls.yml) -> 새 주소로 보내는 리다이렉트 페이지
# 카테고리·태그는 주소(slug)가 같으면 한 페이지로 합치고, 가장 많이 쓴 표기를 이름으로 씁니다.
module Fullfish
  class TaxonomyPages < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      @site = site
      posts = site.posts.docs.reverse # 최신 글 먼저

      # 경로 키는 slug 배열 (["코딩-테스트", "기타"])
      by_path = Hash.new { |h, k| h[k] = [] }
      @names = Hash.new { |h, k| h[k] = Hash.new(0) }
      posts.each do |post|
        cats = Array(post.data["categories"]).map(&:to_s)
        cats.each_index do |i|
          break if warn_empty_slug("category", cats[i])

          key = cats[0..i].map { |name| slug(name) }
          by_path[key] << post
          @names[key][cats[i]] += 1
        end
      end
      @order = tree_order(site)

      site.data["category_nav"] = category_nodes([], by_path)
      by_path.each { |key, list| add_category_page(key, list, by_path) }
      site.data["category_hash_redirects"] = hash_redirects(by_path)

      tags = Hash.new { |h, k| h[k] = [] }
      posts.each do |post|
        Array(post.data["tags"]).map(&:to_s).reject { |tag| warn_empty_slug("tag", tag) }
          .each { |tag| tags[slug(tag)] << [tag, post] }
      end
      index = tags.map do |key, pairs|
        name = most_used(pairs.map(&:first).tally)
        list = pairs.map(&:last).uniq
        add_page("/tags/#{key}/", "layout" => "tag", "title" => name, "posts" => list)
        { "name" => name, "url" => "/tags/#{key}/", "count" => list.size }
      end
      site.data["tag_index"] = index.sort_by { |tag| [-tag["count"], tag["name"]] }

      add_redirects(posts)
    end

    private

    def slug(name)
      Jekyll::Utils.slugify(name)
    end

    def most_used(counts)
      counts.max_by { |name, n| [n, name] }.first
    end

    def name_of(key)
      most_used(@names[key])
    end

    def category_url(key)
      "/categories/#{key.join("/")}/"
    end

    def warn_empty_slug(kind, name)
      return false unless slug(name).empty?

      Jekyll.logger.warn "Taxonomy:", "#{kind} '#{name}' has an empty URL slug; skipped"
      true
    end

    # category_tree.yml 을 깊이 우선으로 훑어 경로 키 => 순번
    def tree_order(site, nodes = site.data.dig("category_tree", "categories"), prefix = [], order = {})
      Array(nodes).each do |node|
        name = (node.is_a?(Hash) ? node["name"] : node).to_s.strip
        next if name.empty?

        key = prefix + [slug(name)]
        order[key] ||= order.size
        tree_order(site, node["children"], key, order) if node.is_a?(Hash)
      end
      order
    end

    def child_keys(prefix, by_path)
      by_path.keys
        .select { |key| key.size == prefix.size + 1 && key.take(prefix.size) == prefix }
        .sort_by { |key| [@order.fetch(key, Float::INFINITY), name_of(key)] }
    end

    def category_nodes(prefix, by_path)
      child_keys(prefix, by_path).map do |key|
        { "name" => name_of(key), "url" => category_url(key), "count" => by_path[key].size,
          "children" => category_nodes(key, by_path) }
      end
    end

    def add_category_page(key, list, by_path)
      children = child_keys(key, by_path).map do |child|
        { "name" => name_of(child), "url" => category_url(child), "count" => by_path[child].size }
      end
      parents = (1...key.size).map { |i| { "name" => name_of(key.take(i)), "url" => category_url(key.take(i)) } }
      add_page(category_url(key), "layout" => "category", "title" => name_of(key), "posts" => list,
                                  "children" => children, "parents" => parents)
    end

    # 예전 사이드바 링크 /categories/#<이름> -> 카테고리 페이지 (같은 이름이면 위쪽 경로 우선)
    def hash_redirects(by_path)
      by_path.keys.sort_by(&:size).each_with_object({}) do |key, map|
        map[key.last] ||= category_url(key)
      end
    end

    def add_page(url, data)
      page = Jekyll::PageWithoutAFile.new(@site, @site.source, url, "index.html")
      page.data.merge!("permalink" => url, "author_profile" => true, "show_category_sidebar" => true)
      page.data.merge!(data)
      @site.pages << page
      page
    end

    def add_redirects(posts)
      legacy = @site.data["legacy_urls"] || {}
      taken = (@site.pages + posts).map(&:url).to_set
      posts.each do |post|
        next unless legacy[post.basename_without_ext]

        old = Jekyll::URL.escape_path(legacy[post.basename_without_ext])
        next if taken.include?(old)

        taken << old
        target = post.url
        page = Jekyll::PageWithoutAFile.new(@site, @site.source, old, "index.html")
        page.data.merge!("permalink" => old, "layout" => nil, "sitemap" => false)
        page.content = <<~HTML
          <!doctype html>
          <html lang="ko">
          <meta charset="utf-8">
          <title>#{CGI.escapeHTML(post.data["title"].to_s)}</title>
          <meta name="robots" content="noindex">
          <link rel="canonical" href="#{@site.config["url"]}#{target}">
          <script>location.replace(#{target.to_json} + location.hash)</script>
          <meta http-equiv="refresh" content="0; url=#{target}">
          <p><a href="#{target}">이 글은 새 주소로 옮겼어요.</a></p>
          </html>
        HTML
        @site.pages << page
      end
    end
  end
end
