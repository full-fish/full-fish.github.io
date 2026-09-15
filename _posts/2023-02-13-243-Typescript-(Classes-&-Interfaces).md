---
title: "Typescript (Classes & Interfaces)"
date: 2023-02-13 20:35:57 +0900
render_with_liquid: false
categories: ["nomadcoder", "Typescript로 블록체인 만들기"]
---

```typescript
type Words = {
[key: string]: string;
};
class Word {
constructor(public term: string, public def: string) {}
}
class Dict {
  private words: Words
  constructor() {
    this.words = {}
  }

  add(term: string) {
    if (this.words[term] === undefined) {
      this.words[term] = ''
    }
  }

  get(term: string) {
    if (this.words[term] !== undefined) {
      return console.log(this.words[term])
    }
  }

  delete(term: string) {
    if (this.words[term] !== undefined) {
      delete this.words[term]
    }
  }

  update(term: string, def: string) {
    if (this.words[term] !== undefined) {
      this.words[term] = def
    }
  }

  showAll() {
    return Object.keys(this.words).forEach(ele => console.log(ele))
  }

  count() {
    return console.log(Object.keys(this.words).length)
  }
}

let dict = new Dict()
console.log('start')
dict.add('dog')
dict.update('dog', '개는 왈왈')
console.log('dict',dict)
dict.get('dog')
dict.delete('dog')
console.log('del 이후',dict)
dict.add('cat')
dict.update('cat','고양이도 왈왈?')
dict.add('parrot')
dict.update('parrot','앵무새 시끄러')
dict.showAll()
dict.count()
```
[TS Playground - An online editor for exploring TypeScript and JavaScript

The Playground lets you write TypeScript or JavaScript online in a safe and sharable way.

www.typescriptlang.org](https://www.typescriptlang.org/play?#code/C4TwDgpgBA6g9gJwCYGcoF4oG8BQBtAawhAC4oVgEBLAOwHMBdMi6+gbhwF8OBjAGwCGKNPGTYcPODRYBXHsEQAKMDIBGfKjyjAICALbNKtOgBooK9ZqhIIAM0Os6ASmycuEwcKgARTcHFQ5tQAbgI6UADuiKhkoqg4gZLSlHIKCIouuIGBwAAWVCgAdFHIaJhYboFuCVACSEiKOvoOxpk1gVS2UI35RSWoeE16DBjomDI0Nra0EEht2dl5BcXRKIO6wxhQAOTb7VCVBzg1dBDAjRst9PPZnd1Lfavr+iMAhGNQE1MzcwELUAgzjIEDQoEkUHA+BBCnw4HQest+mshgwnPtDtVAjYoToLs1yEZrn8Ol0EY9Ss9Nu9xpM7D8bgtsWdoA8VhSUeiapjPmAkGEIHiDATHGYpldnMSoHcyWyBiioNTPrTpjRZgzFr1ZciNiNMFNOVVjoEULk4BEAIJ8PgZSWA4DA0EAeVUACsIPJCkQQCgZUinIVbIgAKICHi5RQQKEYAB8YKkEKhMLhEahTjRhpqkgm53VdodcekkOhsPhzrdHq9PtZfphEHoeXTR2qOOsfi2qoiPj8GQk8aLSfh2woAgQwG2aKQfkKdQa2yQcPHOEnHpkvP5ijnC7M20AODWAFKaoIAJMcPi-B-ZLG+XY5MV4nU9O503dEXV8KTNxT9PfcTF7nkaggAu44AI2vbDefh3h6M4bjwYQvlOq58h+MHXtsgAHNYAiaMAYAI81HoeAD8cGQfUG5gCOCBwGOEHAIUCHrtspEIORKGAK6jgAs3YAEwNQIAO0OACINgA37YR1EmmalrWlRhRZjQOZAA)
