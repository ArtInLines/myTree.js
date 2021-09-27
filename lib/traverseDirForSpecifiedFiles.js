function traverseDirForSpecifiedFiles({ startDir = '', cb = (dirent, path, _) => true, args = [] }) {
	let foundArr = [];
	const pathTree = new Tree();

	do {
		let currentValLine = pathTree.currentValLine().map((dirent) => dirent.name);
		let currentPath = joinPath(startDir, ...currentValLine);
		// console.log({ pathTree, currentValLine, currenVal: pathTree.currentVal, currentBranch: pathTree.currentBranch, currentPath });
		if (pathTree.currentBranch === pathTree || pathTree.currentVal.isDirectory()) {
			const dirContent = readdirSync(currentPath, { withFileTypes: true });
			pathTree.addChildren(dirContent);
		} else if (pathTree.currentVal.isFile()) {
			if (cb(pathTree.currentVal, currentPath, ...args)) foundArr.push(currentPath);
			pathTree.pruneChild();
		} else pruneChild();
	} while (pathTree.hasChildren);

	return foundArr;
}
module.exports = traverseDirForSpecifiedFiles;
