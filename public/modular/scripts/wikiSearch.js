const includeTerms = ['computer', 'technology', 'communication'];
const excludeTerms = ['show', 'movie', 'entertainment', 'fiction', 'game', 'sports', 'politics', 'health', 'fashion'];

function calculateRelevance(searchTerm, title, snippet) {
    var titleScore = title.toLowerCase().includes(searchTerm) ? 2 : 0;
    var snippetScore = snippet.toLowerCase().includes(searchTerm) ? 1 : 0;
    return titleScore + snippetScore;
}

function limitToSingleSentence(snippet) {
    // Extract up to the first sentence from the snippet
    var firstSentence = snippet.replace(/([.!?])\s+/g, "$1 ").split(/(?<=[.!?])\s+/)[0];
    return firstSentence;
}

function searchWikipedia() {
    var searchTerm = $('#searchInput').val().toLowerCase();

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            format: 'json',
            list: 'search',
            srsearch: searchTerm
        },
        dataType: 'jsonp',
        success: function(data) {
            var results = data.query.search;
            var formattedResults = [];
            var processedResults = 0;
            var includeTermFound = false;

            results.sort(function(a, b) {
                var relevanceA = calculateRelevance(searchTerm, a.title, a.snippet);
                var relevanceB = calculateRelevance(searchTerm, b.title, b.snippet);
                return relevanceB - relevanceA;
            });

            results.forEach(function(result) {
                var title = result.title;
                var snippet = result.snippet;
                var limitedSnippet = limitToSingleSentence(snippet);
                var pageId = result.pageid;

                var excludeCheck = !excludeTerms.some(term => snippet.toLowerCase().includes(term) || title.toLowerCase().includes(term));

                if (excludeCheck) {
                    $.ajax({
                        url: 'https://en.wikipedia.org/w/api.php',
                        data: {
                            action: 'query',
                            format: 'json',
                            pageids: pageId,
                            prop: 'pageimages',
                            pithumbsize: 500
                        },
                        dataType: 'jsonp',
                        success: function(imageData) {
                            if (imageData.query.pages[pageId].thumbnail) {
                                var imageUrl = imageData.query.pages[pageId].thumbnail.source;

                                formattedResults.push({
                                    title: title,
                                    snippet: limitedSnippet,
                                    imageUrl: imageUrl,
                                    sourceUrl: 'https://en.wikipedia.org/wiki?curid=' + pageId
                                });

                                includeTermFound = true;
                            }

                            processedResults++;

                            if (processedResults === results.length && includeTermFound) {
                                var queryParams = '?searchTerm=' + encodeURIComponent(searchTerm) +
                                    '&results=' + encodeURIComponent(JSON.stringify(formattedResults));
                                window.location.href = '../pages/searchResults.html' + queryParams;
                            }
                        },
                        error: function() {
                            processedResults++;

                            if (processedResults === results.length && includeTermFound) {
                                var queryParams = '?searchTerm=' + encodeURIComponent(searchTerm) +
                                    '&results=' + encodeURIComponent(JSON.stringify(formattedResults));
                                window.location.href = '../pages/searchResults.html' + queryParams;
                            }
                        }
                    });
                } else {
                    processedResults++;
                }
            });
        },
        error: function() {
            console.error('Error fetching data from Wikipedia API');
        }
    });
}