import React from 'react';
import $ from 'jquery';

import PostList from './PostBoxComponents/PostList.js';
import PostForm from './PostBoxComponents/PostForm.js';
import {API_URL, POLL_INTERVAL} from '../global.js';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pendingId: 0
        };
        this.allowAjaxResponse = true;
    }
    loadPostsFromServer() {
        $.ajax({
            url: API_URL,
            dataType: 'json',
            cache: false,
        })
         .done(function(result){
             if (this.allowAjaxResponse) {
                this.setState({data: result});
             }
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    }
    handleCommentSubmit(comment) {
        var comments = this.state.data;
        comment._id = `prefixId-${this.state.pendingId}`;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments, pendingId: this.state.pendingId+1});
        $.ajax({
            url: API_URL,
            dataType: 'json',
            type: 'POST',
            data: comment,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             this.setState({data: comments});
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    }
    componentDidMount() {
        this.loadPostsFromServer();
        // No more interval
        //setInterval(this.loadCommentsFromServer, POLL_INTERVAL);
    }
    componentWillUnmount() {
        this.allowAjaxResponse = false;
    }
    render() {
        return (
            <div className="commentBox">
                <h1>Posts</h1>
                <PostForm onCommentSubmit={this.handleCommentSubmit.bind(this)} />
                <PostList data={this.state.data} />
            </div>
        );
    }
};