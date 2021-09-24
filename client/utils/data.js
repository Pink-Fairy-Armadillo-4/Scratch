const data = {
  nodes: [
    {
      id: 1,
      name: "Dmitri",
      group: "user",
    },
    {
      id: 2,
      name: "Alex",
      group: "user",
    },
    {
      id: 3,
      name: "Robert",
      group: "user",
    },
    {
      id: 4,
      name: "CSS",
      group: "skill",
    },
    {
      id: 5,
      name: "SQL",
      group: "skill",
    },
    {
      id: 6,
      name: "Algos",
      group: "skill",
    },
    {
      id: 7,
      name: "Alen",
      group: "user",
    },
  ],
  links: [
    {
      source: 3,
      target: 0,
      value: 2,
    },
    {
      source: 3,
      target: 1,
      value: 2,
    },
    {
      source: 4,
      target: 2,
      value: 2,
    },
    {
      source: 5,
      target: 6,
      value: 2,
    },
    {
      source: 3,
      target: 6,
      value: 2,
    },
  ],
}

export default data
