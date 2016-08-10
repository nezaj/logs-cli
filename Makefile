MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

NODE_BIN = node_modules/.bin
NODE = $(NODE_BIN)/babel-node

.PHONY: test repl

test:
	@echo "Running tests..."
	$(NODE_BIN)/mocha 'test/**/*.@(js)'

repl:
	@echo "Starting repl..."
	$(NODE) scripts/repl.js
