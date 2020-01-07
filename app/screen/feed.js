import React from "react";
import { TouchableOpacity, FlatList,StyleSheet, Text, View, Image } from "react-native";
import { f, database, auth, storage } from "../../config/config.js";


export default class feed extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            photo_feed: [0,1,2,3,4],
            refresh: false,
            loading: true
        }
    }

    componentDidMount = () => {
        this.loadFeed();
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

    addToFlatList = (photo_feed, data, photo) => {
        var that = this;
        var photoObj = data[photo];
        database.ref('users').child(photoObj.author).child("username").once('value').then(function(snapshot) {
            const exist = (snapshot.val() !== null);
            if (exist) data = snapshot.val();
            photo_feed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: that.timeConverter(photoObj.posted),
                author: data,
                authorId: photoObj.author
            });
            that.setState({
                refresh:false,
                loading:false
            });
        }).catch((error) => console.log("error: ",error));
    }

    loadFeed = () => {

        this.setState({
            refresh:true,
            photo_feed:[]
        });

        var that = this;
        database.ref('photos').orderByChild('posted').once('value').then(function(snapshot) {
            const exist = (snapshot.val() !== null);
            if (exist) data = snapshot.val();
            var photo_feed = that.state.photo_feed;

            for(var photo in data){
                that.addToFlatList(photo_feed, data, photo);
            }
        }).catch((error) => console.log("error: ",error));
    }

    loadNew = () => {
        // this.setState({
        //     refresh:true
        // });
        // this.setState({
        //     photo_feed:[5,6,7,8,9],
        //     refresh:false
        // })

        // Load Feed
        this.loadFeed()
    }

    render(){
        return(
            <View style={{flex:1}}>

                <View style={{height:70, paddingTop:30, backgroundColor:'white', borderColor:'lightgray', borderBottomWidth:0.5, justifyContent:'center',alignItems:'center'}}>
                    <Text>Feed</Text>
                </View>

                { this.state.loading == true ? (
                    <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                        <Text>Loading....</Text>
                    </View>
                ) : (
                    <FlatList
                        refreshing={this.state.refresh}
                        onRefresh={this.loadNew}
                        data={this.state.photo_feed}
                        keyExtractor={(item, index) => index.toString()}
                        style={{flex:1, backgroundColor:'#eee'}}
                        renderItem={({item,index})=>(
                            <View key={index} style={{width:"100%", overflow:"hidden", marginBottom:5, justifyContent:"space-between", borderBottomWidth:1, borderColor:'gray'}}>
                                <View style={{padding:5, width:"100%", flexDirection:"row", justifyContent:'space-between'}}>
                                    <Text>{item.posted}</Text>
                                    <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("User",{userId: item.authorId})}
                                    >
                                        <Text>{item.author}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <Image
                                        source={{uri:item.url }}
                                        style={{resizeMode: 'cover', width:"100%", height:275}} />
                                </View>

                                <View style={{padding:5}}>
                                    <Text>{item.caption}</Text>
                                    <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Comments',{photoId: item.id})}
                                    >
                                        <Text style={{color:'blue', marginTop:10, textAlign:'center'}}>[ View Comments... ]</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            )}
                    />
                    )}    
            </View>
        )
    }
}

