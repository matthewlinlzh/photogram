import React from "react";
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { f, database, auth, storage } from "../../config/config.js";

import PhotoList from "../components/photoList.js";


export default class userProfile extends React.Component {

    constructor(props){
        super(props);

        this.state = ({
            loaded: false
        })

    }

    componentDidMount = () => {
        this._isMounted = true;
        this.checkParams();
    }

    checkParams=() =>{
        var params = this.props.navigation.state.params;
        if (params.userId){
            this.setState({
                userId: params.userId
            });
            this.fetchUserInfo(params.userId);
        }
    }

    fetchUserInfo = (userId) => {
        var that = this;
        // alert(userId)
        // fetching data from the database using the userId that we passin
        database.ref('users').child(userId).child('username').once('value').then(function(snapshot) {
            const exist = ((snapshot).val() !== null);
            if (exist) data = snapshot.val();
            that.setState({username: data});
        }).catch((error) => console.log(error))

        database.ref('users').child(userId).child('name').once('value').then(function(snapshot) {
            const exist = ((snapshot).val() !== null);
            if (exist) data = snapshot.val();
            that.setState({name: data});
        }).catch((error) => console.log(error))

        database.ref('users').child(userId).child('avatar').once('value').then(function(snapshot) {
            const exist = ((snapshot).val() !== null);
            if (exist) data = snapshot.val();
            that.setState({avatar: data, loaded:true});
        }).catch((error) => console.log(error))
    }

    render(){
        return(
            <View style={{flex:1}}>
                { this.state.loaded == false ? (
                    <View style={{}}>
                    <Text>Loading....</Text>
                    </View>
                ): (
                    <View>
                       <View style={{flexDirection:"row", height:70, paddingTop:30, backgroundColor:'white', borderColor:'lightgrey', borderBottomWidth:0.5, justifyContent:'space-between', alignItems:'center'}}>
                            <TouchableOpacity
                            style={{width:100}}
                            onPress={() => this.props.navigation.goBack()}
                            >
                                <Text style={{fontSize:12, fontWeight:"bold", paddingLeft:10}}>Go back</Text>
                            </TouchableOpacity>
                            <Text>Profile</Text>
                            <Text style={{width:100}}></Text>
                        </View>
                        <View style={{justifyContent:"space-evenly", alignItems:"center",flexDirection:"row", paddingVertical:10}}>
                            <Image source={{ uri:this.state.avatar}} style={{marginLeft:10, width:100, height:100, borderRadius: 50}} />
                            <View style={{marginRight: 10}}>
                                <Text>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                    </View>
                )}
                <PhotoList 
                isUser={true} 
                userId={this.state.userId} 
                navigation={this.props.navigation} 
                /> 
            </View>
        )
    }
}

