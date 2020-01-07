import React from "react";
import { TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { f, database, auth, storage } from "../../config/config.js";

import UserAuth from "../components/auth.js";

export default class comment extends React.Component {

    constructor(props){
        super(props);

        this.state = ({
            loggedin: false,
            comments_list: []
        })

    }

    checkParams = () => {
        var params = this.props.navigation.state.params;
        if (params.photoId){
            this.setState({
                photoId: params.photoId
            });
            this.fetchComments(params.photoId);
        }
    }

    addCommentToList = (comments_list, data, comment) => {
        var that = this;
        var commentObj = data[comment];
        database.ref('users').child(commentObj.author).child('username').once('value').then(function(snapshot){
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();

            comments_list.push({
                id: comment,
                comment:commentObj.comment,
                posted: that.timeConverter(commentObj.posted),
                author: data,
                authorId: commentObj.author
            });

            that.setState({
                refresh: false,
                loading: false
            });
        }).catch(error => console.log(error));
    }

    fetchComments = (photoId) => {
        var that = this;
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function(snapshot){
            const exist = (snapshot.val() != null);
            if (exist){
                data = snapshot.val();
                var comments_list = that.state.comments_list;

                for (var comment in data){
                    that.addCommentToList(comments_list, data, comment);
                }

            }else{
                that.setState({
                    comments_list:[]
                });
            }
        }).catch(error => console.log("this is the error: "+error));
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
            if(user){
                // logged in
                that.setState({
                    loggedin: true
                })
            }
            else{
                // not logged in
                that.setState({
                    loggedin: false
                })
            }
        })
        this.checkParams();
    }

    postComment = () => {
        var comment = this.state.comment;
        if(comment != ''){
            var imageId = this.state.photoId;
            var userId = f.auth().currentUser.uid;
            var commentId = this.uniqueId();
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime / 1000);

            this.setState({
                comment:''
            });

            var commentObj = {
                posted: timestamp,
                author: userId,
                comment: comment
            }

            database.ref("/comments/"+imageId+'/'+commentId).set(commentObj);

            //reload comment
            this.reloadCommentList();
        }else{
            alert('Please enter a comment before posting.')
        }
    }

    reloadCommentList = () => {
        this.setState({
            comments_list:[]
        });
        this.fetchComments(this.state.photoId);
    }


    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() +
        this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    pluarlCheck = (s) => {

        if (s == 1){
            return ' ago';
        } else{
            return 's ago';
        }
    }


    timeConverter = (timedtamp) => {
        var a = new Date(timedtamp * 1000);
        var second = Math.floor((new Date() - a)/1000);

        var interval = Math.floor(second/31536000);
        if(interval > 1){
            return interval+' year' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second/2592000);
        if(interval > 1){
            return interval+' month' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second/86400);
        if(interval > 1){
            return interval+' day' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second/3600);
        if(interval > 1){
            return interval+' hour' + this.pluarlCheck(interval);
        }

        interval = Math.floor(second/60);
        if(interval > 1){
            return interval+' minute' + this.pluarlCheck(interval);
        }

        return Math.floor(second)+' second' + this.pluarlCheck(second);
    }


    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flexDirection:"row", height:70, paddingTop:30, backgroundColor:'white', borderColor:'lightgrey', borderBottomWidth:0.5, justifyContent:'space-between', alignItems:'center'}}>
                    <TouchableOpacity
                    style={{width:100}}
                    onPress={() => this.props.navigation.goBack()}
                    >
                        <Text style={{fontSize:12, fontWeight:"bold", paddingLeft:10}}>Go back</Text>
                    </TouchableOpacity>
                    <Text>Comments</Text>
                    <Text style={{width:100}}></Text>
                </View>
                { this.state.comments_list.length == 0 ? (
                    <Text>No Comments found....</Text>
                ) : (
                    <FlatList 
                    refreshing={this.state.refresh}
                    data={this.state.comments_list}
                    keyExtractor={(item, index) => index.toString()}
                    style={{flex:1, backgroundColor:'#eee'}}
                    renderItem={({item, index})=>(
                        <View key={index} style={{width:"100%", overflow:"hidden", marginBottom:5, justifyContent:"space-between", borderBottomWidth:1, borderColor:'grey'}}>
                            <View style={{padding:5, width:"100%", flexDirection:"row", justifyContent:'space-between'}}>
                                <Text>{item.posted}</Text>
                                <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('User', {userId: item.authorId})}
                                >
                                    <Text>{item.author}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{padding:5}}>
                                <Text>{item.comment}</Text>
                            </View>
                        </View>
                    )}
                    />
                )}
                  { this.state.loggedin == true ? (
                    //are logged in
                    <KeyboardAvoidingView behavior='padding' enabled style={{borderTopWidth:1, borderTopColor:'grey', padding:10, marginBottom:15}}>
                        <Text style={{fontWeight:"bold"}}>Post Comment</Text>
                        <View>
                            <TextInput
                            editable={true}
                            value={this.state.comment}
                            placeholder={'enter your comment here...'}
                            onChangeText={(text) => this.setState({comment:text})}
                            style={{marginVertical:10, height:50, padding:5,borderColor:'grey', borderRadius:3, backgroundColor:'white', color:'black'}}
                            />

                            <TouchableOpacity
                            style={{paddingVertical:10, paddingHorizontal:20,backgroundColor:'blue', borderRadius:5}}
                            onPress={() => this.postComment()}
                            >
                                <Text style={{color:'white'}}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                ): (
                    // not log in
                    <UserAuth message={"Please login to post a comment"} moveScreen={true} navigation={this.props.navigation} />
                )}
                
            </View>
        )
    }
}

