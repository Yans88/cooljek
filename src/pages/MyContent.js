import React, { Component } from 'react'


export default class MyContent extends Component {
    render() {
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">MyContent</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{ "minHeight": "470px" }}>
                                    <div className="card-body">


                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>



        )
    }
}
