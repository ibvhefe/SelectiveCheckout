"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const child_process_1 = require("child_process");
const fs = require("fs");
function run() {
    try {
        const pathsToCheckout = tl.getInput('pathsToCheckout', true);
        let fetchDepth = tl.getInput('fetchDepth', false);
        let repositoryUri = tl.getVariable('Build.Repository.Uri');
        // Parameter validation.
        if (!fetchDepth) {
            console.log('No fetch depth was given, using default of 1');
            fetchDepth = '1';
        }
        if (fetchDepth) {
            if (isNaN(Number(fetchDepth))) {
                tl.setResult(tl.TaskResult.Failed, 'Fetch depth is not a number');
                return;
            }
            if (Number(fetchDepth) < 0) {
                tl.setResult(tl.TaskResult.Failed, 'Fetch depth is less than 0');
                return;
            }
        }
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
        // Checkout.
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
        var response = executeCommand('git init');
        if (response.includes('existing Git repository')) {
            tl.setResult(tl.TaskResult.Failed, 'Repository already exists. Set "checkout:none" in previous checkout task to avoid this error.');
            return;
        }
        executeCommand('git config core.sparsecheckout true');
        for (const path of pathsToCheckout.split('\n')) {
            executeCommand(`echo ${path} >> .git/info/sparse-checkout`);
        }
        const accessToken = tl.getVariable('System.AccessToken');
        const start = repositoryUri.indexOf('dev.azure.com');
        if (start !== -1) {
            repositoryUri = repositoryUri.substring(start);
        }
        executeCommand(`git remote add -f origin https://${accessToken}@${repositoryUri}`);
        const sourceBranch = tl.getVariable('Build.SourceBranch');
        executeCommand(`git pull origin ${sourceBranch} --depth=${fetchDepth}`);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
function executeCommand(command) {
    console.log('##[command]' + command);
    const response = (0, child_process_1.execSync)(command).toString();
    console.log(response);
    return response;
}
run();
