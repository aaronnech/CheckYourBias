# CheckYourBias
403 project

Check out great information [here](https://help.github.com/articles/using-jekyll-with-pages/) on how to get set up jekyll with gh-pages.

[Jekyll documentation](https://jekyllrb.com/docs/home/)


**tl;dr**

if you don't already have jekyll, run

```
gem install jekyll
```

if you don't already have bundler, run
```
gem install bundler
```

then run
```
bundle exec jekyll serve --baseurl '' --watch 
```
and navigate to localhost:4000


**Things to be aware of**

Links should be prepended with site.base_url. gh-pages serves it from 
/CheckYourBias. Running it locally serves it from /, which is why we 
need to override the baseurl when running it on localhost.

