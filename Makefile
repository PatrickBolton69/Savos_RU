REPO := /tmp/savos-repo

$(REPO)/.git:
	git clone https://github.com/PatrickBolton69/Savos_RU.git $(REPO)

sync-files:
	cp index.html style.css script.js $(REPO)/
	rm -rf $(REPO)/img $(REPO)/go
	cp -r img go $(REPO)/

deploy-pages: $(REPO)/.git sync-files
	cd $(REPO) && git checkout gh-pages && git pull origin gh-pages
	cd $(REPO) && git add -A
	cd $(REPO) && git diff --cached --quiet || (git commit -m "Update site $$(date '+%Y-%m-%d %H:%M')" && git push origin gh-pages)
	@echo "→ Deployed to gh-pages. Review at https://savos.ru/"

promote: $(REPO)/.git sync-files
	cd $(REPO) && git checkout main && git pull origin main
	cd $(REPO) && git add -A
	cd $(REPO) && git diff --cached --quiet || (git commit -m "Promote gh-pages to main $$(date '+%Y-%m-%d %H:%M')" && git push origin main)
	@echo "→ Promoted to main."

fetch:
	cd $(REPO) && git checkout gh-pages && git pull origin gh-pages
	cp $(REPO)/index.html $(REPO)/style.css $(REPO)/script.js ./
	rm -rf img go
	cp -r $(REPO)/img $(REPO)/go ./
	@echo "→ Updated /root/www/ from gh-pages."

.PHONY: sync-files deploy-pages promote fetch
