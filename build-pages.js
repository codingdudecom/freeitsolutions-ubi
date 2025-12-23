const DOMAIN_FULL_URL = "https://www.freeitsolutions.com"
var hbs = require('hbs');
const fs = require('fs');
const path = require("path")

hbs.registerHelper('test', function(arg1,arg2,options) {
    return (arg1 == arg2) ? options.fn(this) : "";
});

hbs.registerHelper('article', function(options) {
    return '<article class="d-flex w-100 h-100 mx-auto flex-column pt-5">' 
    + options.fn(this)
    + "</article>";
});

hbs.registerHelper('absolutePath', function(arg1,options) {
    if (arg1.indexOf("http") == 0){
    	return arg1;
    } else {
    	return "https://www.freeitsolutions.com"+arg1;
    }
});

hbs.registerHelper('articleContent', function(options) {
	var template = hbs.compile("{{>blogLatest}}");
	var data = {};
	buildBlogRoll(data);
	var blogLatest = "";
	if(!this.canonical.endsWith("/articles/")){
		blogLatest = template(data);
	}
    return '<div class="text-dark no-shadow mt-5 pb-5 text-start justify-content-center row gx-0"><div class="col-10 col-sm-6 pe-sm-5">' + 
    options.fn(this) + 
    blogLatest +
    '<div id="disqus_thread"></div>'+
    "</div><div class='sidebar col-md-2 col-sm'>"+
    `<!-- FreeITSolutions Vertical Rectangle (300x600) -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-3421619882899259"
     data-ad-slot="7805254435"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`+
    "</div></div>";
});

hbs.registerHelper('image2alt',function(arg1,options){
	var fileName = path.basename(arg1);
	fileName = fileName.substring(0,fileName.lastIndexOf("."));
	return fileName.replace(/-/g," ");
})

hbs.registerHelper('authorUrl', function(authorName) {
    if (typeof authorName !== 'string') {
        return '';
    }
    return '/author/' + authorName.toLowerCase().replace(/\s+/g, '-');
});

hbs.registerHelper('categoryLinks', function(categoryStr) {
    if (!categoryStr || typeof categoryStr !== 'string') {
        return '';
    }
    const categories = categoryStr.split(',').map(c => c.trim());
    const links = categories.map(category => {
        if (!SITE_CATEGORIES.find(({name}) => category == name)){
            return "";
        }
        const slug = category.toLowerCase().replace(/\s+/g, '-');
        return `<a href="/${slug}/" class="text-decoration-none">${category}</a>`;
    });
    return new hbs.SafeString(links.join(', '));
});

hbs.registerHelper('categoryTopMenuLinks', function() {
    const categories = SITE_CATEGORIES.map(({name}) => name);
    const maxLinksInTopMenu = 3;
    if (categories.length <= maxLinksInTopMenu) {
        const links = categories.map(category => {
            var cat = SITE_CATEGORIES.find(({name}) => category == name);
            const slug = category.toLowerCase().replace(/\s+/g, '-');
            cat.shortName && (category = cat.shortName);
            return `<a class="nav-link" href="/${slug}/">${category}</a>`;
        });
        return new hbs.SafeString(links.join(' '));
    } else {
        const mainLinksCount = maxLinksInTopMenu-1;
        const mainLinks = categories.slice(0, mainLinksCount).map(category => {
            var cat = SITE_CATEGORIES.find(({name}) => category == name);
            const slug = category.toLowerCase().replace(/\s+/g, '-');
            cat.shortName && (category = cat.shortName);
            return `<a class="nav-link" href="/${slug}/">${category}</a>`;
        }).join(' ');

        const dropdownLinks = categories.slice(mainLinksCount).map(category => {
            var cat = SITE_CATEGORIES.find(({name}) => category == name);
            const slug = category.toLowerCase().replace(/\s+/g, '-');
            cat.shortName && (category = cat.shortName);
            return `<li><a class="dropdown-item" href="/${slug}/">${category}</a></li>`;
        }).join('');

        const dropdown = `<div class="nav-link nav-item dropdown">
    <a class="dropdown-toggle" href="#" id="exploreTopicsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Explore Topics
    </a>
    <ul class="dropdown-menu" aria-labelledby="exploreTopicsDropdown">
        ${dropdownLinks}
        <li><hr /></li>
        <li><a class="dropdown-item" href="/articles/">All Articles</a></li>
    </ul>
</div>`;
        
        return new hbs.SafeString(mainLinks + ' ' + dropdown);
    }
});

hbs.registerHelper('slice', function(context, block) {

var ret = "",
  offset = parseInt(block.hash.offset) || 0,
  limit = parseInt(block.hash.limit) || 5,
  i = (offset < context.length) ? offset : 0,
  j = ((limit + offset) < context.length) ? (limit + offset) : context.length;



for(i,j; i<j; i++) {
  ret += block.fn(context[i]);
}

  return ret;
});



// New pagination helper
hbs.registerHelper('pagination', function(options) {
	  if (!this.pagination || this.pagination.totalPages <= 1) {
        return '';
    }
    
    const p = this.pagination;
    if (options.data.root.currentPage){
    	p.currentPage = options.data.root.currentPage;
    }
    let html = '<nav aria-label="Blog pagination" class="mt-5" id="pagination"><ul class="pagination justify-content-center">';
    
    // Previous button
    if (p.currentPage > 1) {
        const prevUrl = p.currentPage === 2 ? '/articles/' : `${p.currentPage - 1}/`;
        html += `<li class="page-item">
            <a class="page-link" href="${prevUrl}" rel="prev" aria-label="Previous page">
                <span aria-hidden="true">&laquo;</span> Previous
            </a>
        </li>`;
    } else {
        html += `<li class="page-item disabled">
            <span class="page-link"><span aria-hidden="true">&laquo;</span> Previous</span>
        </li>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, p.currentPage - 2);
    const endPage = Math.min(p.totalPages, p.currentPage + 2);
    
    // First page + ellipsis if needed
    if (startPage > 1) {
        html += `<li class="page-item">
            <a class="page-link" href="/articles/">1</a>
        </li>`;
        if (startPage > 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Current range of pages
    for (let i = startPage; i <= endPage; i++) {
        const pageUrl = i === 1 ? '/articles/' : `/articles/${i}/`;
        const isActive = i === p.currentPage;
        
        html += `<li class="page-item ${isActive ? 'active' : ''}">
            <a class="page-link" href="${pageUrl}" ${isActive ? 'aria-current="page"' : ''}>${i}</a>
        </li>`;
    }
    
    // Last page + ellipsis if needed
    if (endPage < p.totalPages) {
        if (endPage < p.totalPages - 1) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        html += `<li class="page-item">
            <a class="page-link" href="/articles/${p.totalPages}/">${p.totalPages}</a>
        </li>`;
    }
    
    // Next button
    if (p.currentPage < p.totalPages) {
        html += `<li class="page-item">
            <a class="page-link" href="${p.currentPage + 1}/" rel="next" aria-label="Next page">
                Next <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`;
    } else {
        html += `<li class="page-item disabled">
            <span class="page-link">Next <span aria-hidden="true">&raquo;</span></span>
        </li>`;
    }
    
    html += '</ul></nav>';

    html +=`<style>/* Pagination container */
#pagination .pagination {
    padding-left: 0;
    margin: 0;
    list-style: none;
    border-radius: 0.5rem;
    font-family: sans-serif;
}

/* Page items */
#pagination .page-item {
    margin: 0 4px;
}

/* Links */
#pagination .page-link {
    color: #007bff;
    background-color: #fff;
    border: 1px solid #dee2e6;
    padding: 8px 14px;
    font-size: 0.95rem;
    border-radius: 6px;
    transition: background-color 0.2s ease, color 0.2s ease;
    text-decoration: none;
}

/* Hover */
#pagination .page-link:hover {
    background-color: #f1f1f1;
    color: #0056b3;
}

/* Active page */
#pagination .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
    cursor: default;
}

/* Disabled state */
#pagination .page-item.disabled .page-link {
    color: #6c757d;
    background-color: #f8f9fa;
    border-color: #dee2e6;
    cursor: not-allowed;
    opacity: 0.6;
}
</style>`

    return html;
});

hbs.registerHelper('authorInfo', function(authorId, options) {
    // Author data can be managed here.
    const authors = {
        "john-negoita": {
            name: "John Negoita",
            role: "Founder & IT Solutions Architect",
            image: "/img/john-negoita.webp",
            bio: `<p>John is the visionary behind Free IT Solutions, a platform dedicated to empowering individuals in the age of AI. With a background in software engineering and a passion for accessible technology, he focuses on creating tools and resources that help people adapt and thrive in a changing world.</p>
                  <p>He believes in the power of open-source solutions and universal basic income (UBI) as key components for a more equitable future. Through this site, he shares insights on navigating the challenges and opportunities presented by artificial intelligence.</p>`,
            twitter: "https://x.com/codingdudecom",
            linkedin: undefined,//"https://www.linkedin.com/in/johnnegoita/"
            website: "https://www.coding-dude.com"
        }
        // Future authors can be added here.
    };

    const author = authors[authorId];

    if (!author) {
        return `<p style="color:red;">Author "${authorId}" not found.</p>`;
    }

    var template = hbs.compile("{{> authorInfo}}");
	var html = template(author);
    return new hbs.SafeString(html);
});



var x = hbs.registerPartials(__dirname + '/pages/partials', function (err) {
	if (!err){
		var files = getAllFiles('./pages/docs',[]);//.map(file=>file.replace(/pages[\\|/]/g,''));

		var data={};
		data.pages = files.map(file =>{
			return {
				url:file.replace(/pages[\\|/]docs/g,'').replace("index.html","").replace(/\\/g,'/')
			}
		});
		data.generators = [
			{
				name:'Gamer Girl Solutions',
				url:'/gamer-girl-name/',
			},
			{
				name:'Gamer Boy Solutions',
				url:'/gamer-name/',
			},
			{
				name:'Solutions For Boys',
				url:'/nicknames-for-boys/',
			},
			{
				name:'Solutions For Girls',
				url:'/nicknames-for-girls/',
			},
		]
		files.map(file =>{
			data.canonical = DOMAIN_FULL_URL + file.replace(/pages[\\|/]docs/g,'').replace("index.html","").replace(/\\/g,'/');
			if (file.replace(/pages[\\|/]docs/g,'') == "\\blog\\index.html" || file.replace(/pages[\\|/]docs/g,'') == "/articles/index.html"){
				//articlesroll
				buildBlogRoll(data);
			}
			var html = compile(__dirname+'/'+file,data);
			var dir = path.dirname(__dirname+'/'+file.replace(/pages[\\|/]/g,''));

			
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir, { recursive: true });
			}
			fs.writeFileSync(__dirname+'/'+file.replace(/pages[\\|/]/g,''),html);
		})

		buildCategoryPages();

		if (data.posts.length > 10){
			var page = 2, totalPages = Math.ceil(data.posts.length / 10),totalPosts = data.posts.length;
			while (page < totalPages+1){
				var dir = __dirname+'/docs/articles/'+page;

				if (!fs.existsSync(dir)){
				    fs.mkdirSync(dir);
				}

				

				var content = fs.readFileSync(__dirname+"/pages/docs/articles/index.html",'utf8');
				content = content.replace(`{{>blogRoll offset="0" limit="10"}}`,`{{>blogRoll offset="${(page-1)*10}" limit="10"}}`);

				content = content.replace(`{{pagination}}`,`{{pagination page="${page}"}}`);
				var template = hbs.compile(content);

				data.canonical = DOMAIN_FULL_URL + `/articles/${page}/`;
				data.currentPage = page;
				var html = template(data);
				fs.writeFileSync(__dirname+'/docs/articles/'+page+"/index.html",html);
				page++;
			}
		}
	}
});

function getAllPostsWithMetadata() {
    const blogPostsDirs = getAllFolders('./pages/docs/articles');
    const posts = [];
    blogPostsDirs.forEach(postId => {
        const postPath = path.join(__dirname, "pages", "docs", "articles", postId, "index.html");
        if (!fs.existsSync(postPath)) {
            return;
        }
		const content = fs.readFileSync(postPath,'utf8');
		const re = /\{\{>header.*?title='(.*?)'.*?description='(.*?)'.*?\}\}/s;
        const match = content.match(re);
        if (!match) return;

		const fiMatch = content.match(/\{\{>header.*?featured_image='(.*?)'.*?\}\}/s);
		const dateMatch = content.match(/\{\{>header.*?date='(.*?)'.*?\}\}/s);
        const categoryMatch = content.match(/\{\{>header.*?category='(.*?)'.*?\}\}/s);
        const authorMatch = content.match(/\{\{>header.*?author='(.*?)'.*?\}\}/s);
        const tagsMatch = content.match(/\{\{>header.*?tags='(.*?)'.*?\}\}/s);

		posts.push({
			title: match[1],
			url: '/articles/'+postId+'/',
			description: match[2],
			featured_image: fiMatch ? fiMatch[1] : "",
			date: dateMatch ? new Date(dateMatch[1]).getTime() : null,
            category: categoryMatch ? categoryMatch[1] : null,
            author: authorMatch?authorMatch[1]:null,
            tags: tagsMatch?tagsMatch[1]:null,
		});
	});
    return posts.sort((a,b) => (b.date || 0) - (a.date || 0));
}

function buildBlogRoll(data){
	data.posts = getAllPostsWithMetadata();

	var page = data.currentPage || 1, totalPages = Math.ceil(data.posts.length / 10),totalPosts = data.posts.length;
	data.pagination = {
		currentPage: page,
		totalPages: totalPages,
		totalPosts: totalPosts,
		hasNext: page < totalPages,
		hasPrev: page > 1,
		nextPage: page < totalPages ? page + 1 : null,
		prevPage: page > 1 ? page - 1 : null
	};

}


function compile(file,data){
	var content = fs.readFileSync(file,'utf8');
	var template = hbs.compile(content);
	return template(data);
}

const getAllFolders = function(dirPath) {
	files = fs.readdirSync(dirPath)
	return files.filter(file => fs.statSync(dirPath + "/" + file).isDirectory());
}
const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (file === '.DS_Store') {
      return;
    }
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join( dirPath, "/", file))
    }
  })

  return arrayOfFiles
}


const SITE_CATEGORIES = [
    {
        "shortName":"AI",
        "name": "AI Artificial Intelligence",
        "description": "Articles about artificial intelligence"
    },
    {
        "name": "Sustainable Future",
        "description": "Exploring bold ideas, ethical systems, and innovative policies shaping a fairer, more resilient world for all."
    },
    {
        "name": "Circular Economy",
        "description": "Redesigning how we make, use, and reuse resources to build a regenerative, waste-free economy."
    },
    {
        "name": "Carbon Footprint",
        "description": "Understanding, measuring, and reducing emissions to power the transition toward a low-carbon future."
    },
    {
        "name": "Sustainable Living",
        "description": "Embracing mindful choices, eco-friendly habits, and conscious consumption for a greener, balanced lifestyle."
    },
    {
        "name": "Tech for the Future",
        "description": "Harnessing innovation and AI to create smarter, sustainable, and more connected communities."
    }
];


function buildCategoryPages(){
    const allPosts = getAllPostsWithMetadata();

    const categoryTemplateContent = fs.readFileSync(__dirname+"/pages/categoryTemplate.html",'utf8');
    const categoryTemplate = hbs.compile(categoryTemplateContent);

    SITE_CATEGORIES.forEach(category => {
        const slug = category.name.toLowerCase().replace(/\s+/g, '-');
        const dir = path.join(__dirname, 'docs', slug);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const categoryPosts = allPosts.filter(post => post.category && post.category.split(",").indexOf(category.name) >=0 );
        categoryPosts.forEach(post => {
            post.date = new Date(post.date).toISOString().split('T')[0];
        })
        const data = {
            pageTitle: `${category.name}`,
            pageDescription: category.description,
            canonical: `${DOMAIN_FULL_URL}/${slug}/`,
            posts: categoryPosts
        };
        
        const html = categoryTemplate(data);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
}