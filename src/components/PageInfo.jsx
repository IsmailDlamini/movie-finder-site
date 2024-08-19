



const PageInfo = ({ page, pageNumber, numberOfResults }) => {

    switch (page) {

        case "Discover" || "Trending":
            return (
                <div className="list-page-info">
                    <div className="list-type">{page == "Discover" ? "Discover" : "Trending"}</div>

                    <div className="page-number">Page {pageNumber ? pageNumer : 1}</div>
                </div>
            );

        case "Search":
            return (
                <div className="list-page-info search-page">
                    <div className="list-type">Searched for : {query}</div>

                    <div className="page-number">Page {pageNumber ? pageNumber : 1}</div>

                    <div className="number-of-results">
                        {numberOfResults > 0 ? numberOfResults : ""} results
                    </div>
                </div>
            );

    }

}

export default PageInfo;