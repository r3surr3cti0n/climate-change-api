const PORT = 5500;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const articles = [];
const newspapers = [
	{
		id: "theguardian",
		name: "The Guardian",
		url: "https://www.theguardian.com/environment/climate-crisis",
		base: "",
	},
	{
		id: "bbc",
		name: "BBC",
		url: "https://www.bbc.com/news/science-environment-56837908",
		base: "https://www.bbc.com",
	},
	{
		id: "climatehome",
		name: "Climate Home News",
		url: "https://www.climatechangenews.com/climate-change-news/",
		base: "",
	},
];

const addURL = (title, url, paperId, paperName, paperBase) => {
	let contains = false;
	articles.forEach((item) => {
		if (item.url == url) {
			contains = true;
		}
	});
	url = paperBase + url;
	// If the url is not in the array add it
	if (!contains) articles.push({ paperId, title, url, paperName });
};

const getArticles = (paper) => {
	axios
		.get(paper.url)
		.then((response) => {
			const html = response.data;

			const $ = cheerio.load(html);
			$('a:contains("climate")', html).each(function () {
				const title = $(this).text().trim();
				const url = $(this).attr("href");

				addURL(title, url, paper.id, paper.name, paper.base);
			});
		})
		.catch((err) => console.log(err));
};

newspapers.forEach((paper) => {
	getArticles(paper);
});

app.get("/", (req, res) => res.json("Welcome to my Climate Change API!"));

// Display all articles
app.get("/news", (req, res) => {
	res.json(articles);
});

// Display articles based on their ID
app.get("/news/:paperId", (req, res) => {
	const paperId = req.params.paperId;
	const newArticles = articles.filter((item) => item.paperId == paperId);
	res.json(newArticles);
});

// Listen to any changes on the choosen PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
