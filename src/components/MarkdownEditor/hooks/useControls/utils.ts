export const mermaidExample = {
  grafh: `
graph TD
  A[开始] --> B{Is it?};
  B -->|Yes| C[OK];
  C --> D[Rethink];
  D --> B;
  B ---->|No| E[End];
`,
  pie: `
pie
  title Key elements in Product X
  "Calcium": 42.96
  "Potassium": 50.05
  "Magnesium": 10.01
  "Iron":  5
`,
  gantt: `
gantt
  title A Gantt Diagram
  dateFormat  YYYY-MM-DD
  section Section
  A task           :a1, 2014-01-01, 30d
  Another task     :after a1  , 20d
  section Another
  Task in sec      :2014-01-12  , 12d
  another task      : 24d  
`,
  sequenceDiagram: `
sequenceDiagram
  participant John
  participant Alice
  Alice->>John: Hello John, how are you?
  John-->>Alice: Great!
`,
}
