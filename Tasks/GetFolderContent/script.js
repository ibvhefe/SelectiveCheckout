const tl = require('azure-pipelines-task-lib/task');
const fs = require('fs');
const path = require('path');

try {
    const parentFolder = tl.getInput('ParentFolder', true);

    const files = fs.readdirSync(path.join(parentFolder));

    console.log('Content of '+parentFolder + ':');
    for (const file of files) {
        console.log('- ' + file);   
    }
    
} catch (error) {
    tl.setResult(tl.TaskResult.Failed, error);
}
