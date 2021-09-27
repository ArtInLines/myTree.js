const { resolve: joinPath } = require('path');
const { readdirSync } = require('fs');

class Tree {
	constructor(children) {
		this.depth = 0;
		this.children = [];
		this.addDirectChildren(children, true);
	}

	get hasChildren() {
		return this.children.length > 0;
	}

	get firstChild() {
		return this.children[0] || this;
	}

	/** @returns {(Tree | Branch)} */
	get currentBranch() {
		let currentBranch = this;
		for (let i = 0; i < this.depth; i++) currentBranch = currentBranch.firstChild;
		return currentBranch;
	}

	get currentParentBranch() {
		return this.currentBranch.parent;
	}

	get currentVal() {
		return this.currentBranch.val ? this.currentBranch.val : null;
	}

	currentValLine(reverse = false) {
		let currentBranch = this.firstChild;
		let allValues = currentBranch.val ? [currentBranch.val] : [];
		for (let i = 1; i < this.depth; i++) {
			// Starts with i = 1, because currentBranch is set to the first child already
			currentBranch = currentBranch.firstChild;
			if (reverse) allValues.unshift(currentBranch.val);
			else allValues.push(currentBranch.val);
		}
		return allValues;
	}

	addChildren(children, addDepth = true) {
		if (this.currentBranch === this) return this.addDirectChildren(children, addDepth);
		this.currentBranch.addChildren(children);
		if (addDepth) this.depth++;
	}

	addDirectChildren(children, addDepth = false) {
		this.children.push(...(Array.isArray(children) ? children.map((child) => new Branch(child, this)) : children ? [new Branch(children, this)] : []));
		if (addDepth && children) this.depth++;
	}

	pruneChild() {
		const parent = this.currentParentBranch;
		if (parent === this) return this.pruneDirectChild();
		// console.log({ i: this.i, depth: this.depth, parent, current: this.currentBranch });
		parent.pruneChild();
		if (!parent.hasChildren) {
			this.depth--;
			this.pruneChild();
			// Prune parent, since it has no children left
			// If parent doesn't get pruned,
			// parent might get the same children added, that were just pruned,
			// resulting in an endless loop
		}
	}

	pruneDirectChild(index = 0) {
		if (!this.hasChildren) return null;
		this.children[index].parent = null;
		this.children.splice(index, 1);
		if (!this.hasChildren) {
			console.assert(this.depth === 1, 'this.depth should be 1, when direct children are pruned');
			this.depth--;
		}
	}
}
module.exports = Tree;
