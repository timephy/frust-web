const commit_sha = process.env["GITHUB_SHA"];
const timestamp = new Date().toISOString();

const output = {
    commit_sha,
    timestamp
};

console.log(JSON.stringify(output, null, 4));
