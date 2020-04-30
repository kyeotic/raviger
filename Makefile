.PHONY: help run-docs docs deploy

HELP_FUNC = \
    %help; \
    while(<>) { \
        if(/^([a-z0-9_-]+):.*\#\#(?:@(\w+))?\s(.*)$$/) { \
            push(@{$$help{$$2}}, [$$1, $$3]); \
        } \
    }; \
    print "usage: make [target]\n"; \
    for ( sort keys %help ) { \
        print "$$_\n"; \
        printf("  %-20s %s\n", $$_->[0], $$_->[1]) for @{$$help{$$_}}; \
        print "\n"; \
    }

help:
	@perl -e '$(HELP_FUNC)' $(MAKEFILE_LIST)

run-docs: ## Run in development mode
	cd docs && hugo serve -D

docs: ## Build the site
	cd docs && hugo -t learn -d public --gc --minify --cleanDestinationDir

sync-docs: ## update docs theme submodules
	git submodule update --init --recursive