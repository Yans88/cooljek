import React, { Component } from 'react'

export default class MyLoading extends Component {
    render() {
        return (
            <div>
                <div className="card shadow-lg" style={{ "height": "450px" }}>
                    <div className="card-body my-card-body">
                        <div id="loader"></div>
                                            Loading ...
                    </div>
                </div>
            </div>
        )
    }
}
