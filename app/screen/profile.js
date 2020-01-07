import React from "react";
import { TextInput, FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { f, database, auth, storage } from "../../config/config.js";

import PhotoList from "../components/photoList.js";
import UserAuth from "../components/auth.js";



export default class profile extends React.Component {

    constructor(props){
        super(props);

        this.state = ({
            loggedin: false
        })

    }

    fetchUserInfo = (userId) => {
        var that = this;
        database.ref('users').child(userId).once('value').then(function(snapshot){
            const exist = (snapshot.val() != null);
            if(exist) data = snapshot.val();
            that.setState({
                username: data.username,
                name: data.name,
                avatar: data.avatar,
                loggedin:true,
                userId: userId
            })
        });
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
            if(user){
                // logged in
                that.fetchUserInfo(user.uid);
            }
            else{
                // not logged in
                that.setState({
                    loggedin: false
                })
            }
        })
    }

    logoutUser = () => {
        f.auth().signOut();
        alert('Logged out');
    }

    editProfile = () => {
        this.setState({editProfile: true})
    }

    saveProfile = () => {
        var name = this.state.name;
        var username = this.state.username;

        if (name != ''){
            database.ref('users').child(this.state.userId).child('name').set(name);
        }
        if (username != ''){
            database.ref('users').child(this.state.userId).child('username').set(username);
        }

        this.setState({editProfile:false});
    }

    render(){
        return(
            <View style={{flex:1}}>
                { this.state.loggedin == true ? (
                    //are logged in
                    <View style={{flex:1}}>
                        {/* headind  */}
                        <View style={{height:70, paddingTop:30, backgroundColor:'white', borderColor:'lightgray', borderBottomWidth:0.5, justifyContent:'center',alignItems:'center'}}>
                            <Text>Profile</Text>
                        </View>
                        {/* user avator and describtion */}
                        <View style={{justifyContent:"space-evenly", alignItems:"center",flexDirection:"row", paddingVertical:10}}>
                            <Image source={{ uri: this.state.avatar}} style={{marginLeft:10, width:100, height:100, borderRadius: 50}} />
                            <View style={{marginRight: 10}}>
                                <Text>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                        {/* functional button */}
                        { this.state.editProfile == true ? (
                            <View style={{alignItems:"center", justifyContent:"center", paddingBottom:20, borderBottomWidth:1}}>
                               <TouchableOpacity onPress={() => this.setState({editProfile:false})}>
                                   <Text style={{fontWeight:"bold"}}>Cancel Editing</Text>
                               </TouchableOpacity>
                               <Text>Name: </Text>
                               <TextInput 
                               editable={true}
                               placeholder={'enter your name'}
                               onChangeText={(text) => this.setState({name:text})}
                               value={this.state.name}
                               style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderWidth:1}}
                               />

                                <Text>Username: </Text>
                               <TextInput 
                               editable={true}
                               placeholder={'enter your Username'}
                               onChangeText={(text) => this.setState({username:text})}
                               value={this.state.username}
                               style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderWidth:1}}
                               />
                               <TouchableOpacity 
                               style={{backgroundColor:"blue", padding:10}}
                               onPress={() => this.saveProfile()}>
                                   <Text style={{fontWeight:"bold", color:"white"}}>Save Changes</Text>
                               </TouchableOpacity>
                            </View>
                        ): (
                            <View style={{paddingBottom:20, borderBottomWidth:1}}>
                                <TouchableOpacity 
                                onPress={() => this.logoutUser()}
                                style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius: 20, borderColor:"grey", borderWidth:1.5}}>
                                    <Text style={{textAlign:"center", color:"gray"}}>Logout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={()=>this.editProfile()}
                                style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius: 20, borderColor:"grey", borderWidth:1.5}}>
                                    <Text style={{textAlign:"center", color:"gray"}}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={() => this.props.navigation.navigate('Update')}
                                style={{backgroundColor:'gray', marginTop:10, marginHorizontal:40, paddingVertical:35, borderRadius: 20, borderColor:"grey", borderWidth:1.5}}>
                                    <Text style={{textAlign:"center", color:"white"}}>Upload New +</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <PhotoList 
                        isUser={true} 
                        userId={this.state.userId} 
                        navigation={this.props.navigation} 
                        /> 
                    </View>
                ): (
                    // not log in
                    <UserAuth message={"Please login to View your Profile"} />
                )}
                
            </View>
        )
    }
}

