---
title: "여행경로 (백트래킹 / Hierholzer’s algorithm 예제)"
date: 2025-10-17 16:12:48 +0900
render_with_liquid: false
categories: ["코딩 테스트", "프로그래머스 level3"]
---

```python
# 처음에 bfs로 풀려고 했으나 백트래킹이 안되므로
def solution(tickets):
    result = []
    obj = {}

    for ticket in tickets:
        obj.setdefault(ticket[0], []).append(ticket[1])

    for v in obj.values():
        v.sort()
    queue = dq(["ICN"])

    last = ""
    while queue:
        current = queue.popleft()
        result.append(current)
        if not obj.get(current):
            break
        for next in obj[current]:
            if next in obj:
                queue.append(next)
                obj[current].remove(next)
                break
            else:
                last = next
    if len(result) != len(tickets) + 1:
        result.append(last)
    return result
    
 # 이렇게 풀어야함
 def solution(tickets):
    result = []
    obj = {}

    for a, b in tickets:
        obj.setdefault(a, []).append(b)

    for v in obj.values():
        v.sort(reverse=True)

    stack = ["ICN"]

    while stack:
        current = stack[-1]
        if obj.get(current):
            stack.append(obj[current].pop())
        else:
            result.append(stack.pop())
    return result[::-1]
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/286/img.png)
