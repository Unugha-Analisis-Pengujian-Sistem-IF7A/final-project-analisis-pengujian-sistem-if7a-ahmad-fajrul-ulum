const fs = require('fs');

try {
    const data = fs.readFileSync('sonar_code_smells.json', 'utf8');
    const json = JSON.parse(data);

    const ruleCounts = {};
    const fileCounts = {};

    json.issues.forEach(issue => {
        // Count rules
        const rule = issue.rule;
        ruleCounts[rule] = (ruleCounts[rule] || 0) + 1;

        // Count files
        const file = issue.component.split(':').pop();
        if (!fileCounts[file]) {
            fileCounts[file] = [];
        }
        fileCounts[file].push(rule);
    });

    console.log("=== Rule Summary ===");
    Object.entries(ruleCounts)
        .sort(([, a], [, b]) => b - a)
        .forEach(([rule, count]) => console.log(`${rule}: ${count}`));

    console.log("\n=== File Breakdown ===");
    Object.entries(fileCounts)
        .sort(([, a], [, b]) => b.length - a.length)
        .forEach(([file, rules]) => {
            console.log(`${file}: ${rules.length} issues`);
            // console.log(`  Rules: ${[...new Set(rules)].join(', ')}`);
        });

} catch (err) {
    console.error("Error parsing JSON:", err);
}
