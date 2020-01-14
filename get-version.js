const commit_sha = process.env["GITHUB_SHA"];
const date = new Date().toISOString();

const output = {
    commit_sha: commit_sha,
    date: date
};

console.log(JSON.stringify(output, null, 4));
