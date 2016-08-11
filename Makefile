MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

NODE_BIN = node_modules/.bin
NODE = $(NODE_BIN)/babel-node

.PHONY: check test repl lint

check:
	@echo "Running check suite..."
	npm i
	$(MAKE) test lint

test:
	@echo "Running tests..."
	$(NODE_BIN)/mocha 'test/**/*.@(js)'

repl:
	@echo "Starting repl..."
	$(NODE) scripts/repl.js

lint:
	@echo "Running eslint..."
	$(NODE_BIN)/eslint --ext .js --ext .jsx src
	$(NODE_BIN)/eslint test
