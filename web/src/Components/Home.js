import React from "react";
import { Link } from "react-router-dom";


class Home extends React.Component {
    render() {
        return (
            <div className="modules">
                <div className="container" id="banner">
                    <div className="title gradient gradient_cold">exTensy</div>
                    <div className="card">
                        <div className="card_title">Submission for the Wrike Contest</div>
                        <div className="card_contacts">
                            <span className="photo"><img src="/img/savva.png" /></span>
                            <span className="date">12 Aug</span>
                            <span><a className="injected_btn" href="#solution" draggable="false">Discuss</a></span>
                        </div>
                    </div>
                    <div className="text"><span className="gradient gradient_green">Discuss</span> tasks right on the <span className="gradient gradient_hot">wrike</span> platfrom</div>
                </div>
                <div className="container" id="solution">
                    <div className="title">Problem and Our Solution</div>
                    <div className="block_flex">
                        <div className="block_content">
                            <img src="/img/picture_before.png" />
                            <div className="text"><span className="gradient gradient_hot">STOP</span> wasting time on multiple talks around your tasks</div>
                        </div>
                        <div className="block_content">
                            <img src="/img/picture_after.png" />
                            <div className="text"><span className="gradient gradient_green">USE</span> exTensy to discuss the tasks right on the wrike platform and get them done faster</div>
                        </div>
                    </div>
                </div>
                <div className="container" id="download">
                    <div className="title">Steps to success</div>
                    <div className="screenshots">
                        <div className="screenshot">
                            <img src="/img/1.png" />
                            <div className="screenshot_title">1. Download exTensy and switch it on</div>
                        </div>
                        <div className="screenshot">
                            <img src="/img/2.png" />
                            <div className="screenshot_title">2. Choose any assigned task on the Wrike platfrom</div>
                        </div>
                        <div className="screenshot">
                            <img src="/img/3.png" />
                            <div className="screenshot_title">3. Discuss the card with your teammate and edit it right during the call</div>
                        </div>
                    </div>
                </div>
                <div className="hero_footer">
                    <div className="text">Make your team more <span className="gradient gradient_green">productive</span>!</div>
                    <div className="btn_block">
                        <a href="/extension.zip" download="" className="injected_btn" onClick={() => { this.props.onPopup(true, 'download'); }}>Download</a>
                    </div>
                    <div className="github">
                        <a href="https://github.com/mike-petrov/wrike-contest-2019">
                            <img src="/img/github.png" alt="" />
                        </a>
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
