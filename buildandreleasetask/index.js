"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const child_process_1 = require("child_process");
const fs = require("fs");
function run() {
    try {
        const pathsToCheckout = tl.getInput('pathsToCheckout', true);
        let repositoryUri = tl.getVariable('Build.Repository.Uri');
        if (pathsToCheckout == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        if (!pathsToCheckout) {
            tl.setResult(tl.TaskResult.Failed, 'No input was given');
            return;
        }
        if (pathsToCheckout.split('\n').length == 0) {
            tl.setResult(tl.TaskResult.Failed, 'No paths were given');
            return;
        }
        if (!repositoryUri) {
            tl.setResult(tl.TaskResult.Failed, 'Build.Repository.LocalPath is not set');
            return;
        }
        const repoPath = tl.getVariable('Build.Repository.LocalPath');
        if (repoPath) {
            if (!fs.existsSync(repoPath)) {
                fs.mkdirSync(repoPath, { recursive: true });
                console.log('Created folder:', repoPath);
            }
            else {
                console.log('Using folder:', repoPath);
            }
        }
        else {
            console.error('Build.Repository.LocalPath is not set');
            return;
        }
        process.chdir(repoPath);
        executeCommand('git init');
        executeCommand('git config core.sparsecheckout true');
        for (const path of pathsToCheckout.split('\n')) {
            executeCommand(`echo ${path} >> .git/info/sparse-checkout`);
        }
        executeCommand('git remote remove origin');
        const accessToken = tl.getVariable('System.AccessToken');
        const start = repositoryUri.indexOf('dev.azure.com');
        if (start !== -1) {
            repositoryUri = repositoryUri.substring(start);
        }
        executeCommand(`git remote add -f origin https://${accessToken}@${repositoryUri}`);
        const sourceBranch = tl.getVariable('Build.SourceBranch');
        executeCommand(`git pull origin ${sourceBranch} --depth=1`);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
function executeCommand(command) {
    console.log('##[command]' + command);
    const response = (0, child_process_1.execSync)(command).toString();
    console.log(response);
}
run();
