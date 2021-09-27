class Branch {
	constructor(val, parent, children) {
		this.val = val;
		this.children = Array.isArray(children) ? children : children ? [children] : [];
		this.parent = parent;
	}

	get hasChildren() {
		return this.children.length > 0;
	}

	get firstChild() {
		return this.children[0] || this;
	}

	addChildren(children) {
		this.children.push(
			...children.map((child) => {
				if (child instanceof Branch) return child;
				return new Branch(child, this);
			})
		);
	}

	pruneChild(index = 0) {
		this.children[index].parent = null; // to make sure garbage collection takes care of the pruned child
		return this.children.splice(index, 1);
	}
}
module.exports = Branch;
