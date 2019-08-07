import React from "react";
import { Link } from "react-router-dom";


class Home extends React.Component {
    render() {
        return (
            <div className="modules">
                <div className="container" id="banner">
                    <div className="title gradient gradient_cold">exTensy</div>
                    <div className="card">
                        <div className="card_title">Publish our extension</div>
                        <div className="card_contacts">
                            <span className="photo"><img src="./img/savva.png" /></span>
                            <span className="date">12 Aug</span>
                            <span><a className="injected_btn" href="#download" draggable="false">Discuss</a></span>
                        </div>
                    </div>
                    <div className="text">Use the only one Wrike account with all the neccessary tools for efficient team work</div>
                </div>
                <div className="container" id="download">
                    <div className="text">Steps to success:</div>
                    <div className="screenshots">
                        <div className="screenshot">
                            <img src="./img/1.png" />
                            <div className="screenshot_title">1. Download Extensy and switch it on</div>
                        </div>
                        <div className="screenshot">
                            <img src="./img/1.png" />
                            <div className="screenshot_title">2. Choose any task on the Wrike platfrom</div>
                        </div>
                        <div className="screenshot">
                            <img src="./img/1.png" />
                            <div className="screenshot_title">3. Discuss the card with your teammate and edit it right during the call</div>
                        </div>
                    </div>
                </div>
                <div className="hero_footer">
                    <div className="text">Make your team more productive!</div>
                    <div className="btn_block">
                        <a href="/" className="injected_btn">TRY NOW</a>
                    </div>
                </div>
                <div className="footer">
                    <a href="/" className="text gradient gradient_cold">tensyteam.ru</a>
                </div>
            </div>
        );
    }
};

export default Home;
