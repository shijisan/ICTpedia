const includeTerms = ['computer', 'technology', 'communication'];
const excludeTerms = ['show', 'movie', 'entertainment', 'fiction', 'game', 'sports', 'politics', 'health', 'fashion'];

function calculateRelevance(searchTerm, title, snippet) {
    // Calculate a relevance score based on the similarity between the search term and title/snippet
    var titleScore = title.toLowerCase().includes(searchTerm) ? 2 : 0;
    var snippetScore = snippet.toLowerCase().includes(searchTerm) ? 1 : 0;
    return titleScore + snippetScore;
}

function searchWikipedia() {
    // Get the search term from the input field
    var searchTerm = $('#searchInput').val().toLowerCase();

    // Make a request to the Wikipedia API
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
            // Process the results and redirect to another page
            var results = data.query.search;

            // Build an array to store the results
            var formattedResults = [];

            var processedResults = 0;  // Track the number of processed results

            // Flag to check if at least one result contains the include term
            var includeTermFound = false;

            // Sort the results based on relevance
            results.sort(function(a, b) {
                var relevanceA = calculateRelevance(searchTerm, a.title, a.snippet);
                var relevanceB = calculateRelevance(searchTerm, b.title, b.snippet);
                return relevanceB - relevanceA; // Sort in descending order
            });

            results.forEach(function(result) {
                var title = result.title;
                var snippet = result.snippet;
                var pageId = result.pageid;

                // Check if the snippet or title contains any excluded terms
                var excludeCheck = !excludeTerms.some(term => snippet.toLowerCase().includes(term) || title.toLowerCase().includes(term));

                // Check if the snippet or title contains any included terms
                var includeCheck = includeTerms.some(term => snippet.toLowerCase().includes(term) || title.toLowerCase().includes(term));

                // Check if the page is related to the inventor of the telephone
                var isAlexanderGrahamBell = title.toLowerCase().includes('alexander graham bell') || snippet.toLowerCase().includes('alexander graham bell');

                if (excludeCheck && (includeCheck || isAlexanderGrahamBell)) {
                    // Get the first image for each result
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
                            // Check if the page has an image
                            if (imageData.query.pages[pageId].thumbnail) {
                                var imageUrl = imageData.query.pages[pageId].thumbnail.source;

                                // Add the formatted result to the array
                                formattedResults.push({
                                    title: title,
                                    snippet: snippet,
                                    imageUrl: imageUrl
                                });

                                // Set the flag to true if at least one result contains the include term
                                includeTermFound = true;
                            }

                            // Increment the number of processed results
                            processedResults++;

                            // Check if all results have been processed
                            if (processedResults === results.length && includeTermFound) {
                                // Redirect to another page with the search term and results as query parameters
                                var queryParams = '?searchTerm=' + encodeURIComponent(searchTerm) +
                                    '&results=' + encodeURIComponent(JSON.stringify(formattedResults));
                                window.location.href = '../pages/searchResults.html' + queryParams;
                            }
                        },
                        // Handle errors during the image request
                        error: function() {
                            processedResults++;

                            // Check if all results have been processed
                            if (processedResults === results.length && includeTermFound) {
                                // Redirect to another page with the search term and results as query parameters
                                var queryParams = '?searchTerm=' + encodeURIComponent(searchTerm) +
                                    '&results=' + encodeURIComponent(JSON.stringify(formattedResults));
                                window.location.href = '../pages/searchResults.html' + queryParams;
                            }
                        }
                    });
                } else {
                    // Increment the number of processed results for excluded or missing include terms
                    processedResults++;
                }
            });
        },
        // Handle errors during the main API request
        error: function() {
            console.error('Error fetching data from Wikipedia API');
        }
    });
}
