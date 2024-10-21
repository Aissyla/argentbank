import React from "react";
import { Link } from "react-router-dom";
import '../index.css';
function Error () {
    return (
        <div className="error-page">
            <main>
                <section className="error">
                    <h1 className="text-404">Error 404</h1>
                    <p className="text-error">The requested page doesn't exist...</p>
                    < Link to="/">
                        <button className="button-404">Back to the homepage</button>
                    </Link>
                </section>
            </main>
        </div>
    )
}

export default Error