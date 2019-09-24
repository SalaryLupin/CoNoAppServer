const categories = [
  "known", // 아는 정도에 대한 카테고리
]

const tags = {
  known: [
    { name: "모르는 노래", code: "A-1" },
    { name: "아는 노래", code: "A-2" },
    { name: "잘 부르는 노래", code: "A-3" },
  ]
}

exports.category = categories
exports.tag = tags

exports.tags = (req, res) => {
  res.json(tags)
}

exports.categories = (req, res) => {
  res.json(categories)
}
