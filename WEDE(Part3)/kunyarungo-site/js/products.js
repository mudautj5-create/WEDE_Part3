/* Dynamic product listing with search, category filter and sorting.
   Products are loaded from data/products.json using fetch (DOM is built with JavaScript). */
(function () {
  'use strict';

  var grid = document.getElementById('productGrid');
  var search = document.getElementById('searchBox');
  var category = document.getElementById('categoryFilter');
  var sort = document.getElementById('sortSelect');
  var count = document.getElementById('resultCount');
  var products = [];

  function rand(n) {
    return 'R' + n.toLocaleString('en-ZA');
  }

  function render(list) {
    grid.innerHTML = '';
    if (!list.length) {
      var p = document.createElement('p');
      p.className = 'no-results';
      p.textContent = 'No products match your search. Try a different word or clear the filters.';
      grid.appendChild(p);
      count.textContent = '0 products found';
      return;
    }
    list.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'card product-card reveal visible';

      var img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.width = 800;
      img.height = 520;

      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = item.category;

      var h3 = document.createElement('h3');
      h3.textContent = item.name;

      var desc = document.createElement('p');
      desc.textContent = item.description;

      var price = document.createElement('p');
      price.className = 'price';
      price.textContent = (item.category === 'Consultation services' ? 'From ' : 'From ') + rand(item.price);

      var meta = document.createElement('p');
      meta.className = 'hint';
      meta.textContent = item.stock + ' | lead time about ' + item.leadTimeDays + ' days';

      var link = document.createElement('a');
      link.className = 'btn';
      link.href = 'enquiry.html?product=' + encodeURIComponent(item.id);
      link.textContent = 'Enquire about this';

      [img, tag, h3, desc, price, meta, link].forEach(function (el) { card.appendChild(el); });
      grid.appendChild(card);
    });
    count.textContent = list.length + (list.length === 1 ? ' product found' : ' products found');
  }

  function update() {
    var q = search.value.trim().toLowerCase();
    var cat = category.value;
    var list = products.filter(function (p) {
      var text = (p.name + ' ' + p.description + ' ' + p.category).toLowerCase();
      return (cat === 'all' || p.category === cat) && (!q || text.indexOf(q) !== -1);
    });
    var mode = sort.value;
    list.sort(function (a, b) {
      if (mode === 'price-asc') { return a.price - b.price; }
      if (mode === 'price-desc') { return b.price - a.price; }
      return a.name.localeCompare(b.name);
    });
    render(list);
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  fetch('data/products.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    })
    .then(function (data) {
      products = data;
      var cats = Array.from(new Set(products.map(function (p) { return p.category; }))).sort();
      cats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        category.appendChild(opt);
      });
      update();
    })
    .catch(function () {
      grid.innerHTML = '<p class="no-results">Sorry, the product list could not be loaded. Please refresh the page or <a href="contact.html">contact us</a>.</p>';
    });

  search.addEventListener('input', debounce(update, 150));
  category.addEventListener('change', update);
  sort.addEventListener('change', update);
})();
