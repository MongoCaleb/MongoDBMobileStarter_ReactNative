const React = require('react');
const { Button, StyleSheet, Text, View, ScrollView, Modal, TextInput } = require('react-native');
const stitch = require('./stitch_helpers');
const { Stitch, AnonymousCredential, UserApiKeyCredential } = require('mongodb-stitch-react-native-sdk');

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			errorState: undefined,
			currentUserId: undefined,
			client: undefined,
			results: undefined,
			funcResults: '',
			modalVisible: false
		};

		this._onPressLogin = this._onPressLogin.bind(this);
		this._onPressLogout = this._onPressLogout.bind(this);
		this._onPressGetData = this._onPressGetData.bind(this);
		this._onPressCallFunction = this._onPressCallFunction.bind(this);
	}

	componentDidMount() {
		/**
		 * Initialize the Stitch client on load
		 */
		stitch.initStitchClient().then(client=>{
			this.setState({client: client});
			if(client.auth.isLoggedIn) {
				this.setState({ currentUserId: client.auth.user.id })
				}
		})
		.catch(err=>{
			console.log('Stitch Initialization Error: ', err);
			this.state.errorState = "Stitch failed to initialize";
		});
	}

	render() {
		let loginStatus = "You are currently logged out."
		if(this.state.currentUserId) {
			loginStatus = `You are logged in as user \'${this.state.currentUserId}\'.`
		}

		loginButton = <Button onPress={this._onPressLogin} title="Login"
							color='green'/>

		logoutButton = <Button onPress={this._onPressLogout} title="Logout"
							color='palevioletred'/>

		getData = <Button onPress={this._onPressGetData} title="Get Data" />
		callFunc = <Button onPress={this._onPressCallFunction} 
						title="Call Function"
						color='mediumslateblue'/>

		dataModal = <Modal 
			animationType="slide" 
			transparent={false}
			visible={this.state.modalVisible}
			onRequestClose={() => {}}>
				<View>
					<Button
						title = '[X] Close this modal'
						onPress={() => {
						this.setState({modalVisible: false});
						}}>
					</Button>
					<ScrollView> 
						<Text style={styles.results}>{this.state.results} </Text>
					</ScrollView>
				</View>
			</Modal>

		return (
			<View style={styles.container}>
				<Text style={styles.error}> {this.state.errorState} </Text>
				<Text style={styles.title}>Stitch React Native Starter App</Text>
				<Text> {loginStatus} </Text>
				<View style={{flex:0.01}}/>
				{this.state.currentUserId !== undefined ? logoutButton : loginButton}
				<View style={{flex:0.01}}/>
				{this.state.currentUserId !== undefined ? getData : null }
				<View style={{flex:0.01}}/>
				{this.state.currentUserId !== undefined ? callFunc : null }
				<ScrollView> 
					<Text style={styles.results}>{this.state.funcResults} </Text>
				</ScrollView>
				{dataModal}
			</View>
		);
	}

	/**
	 * Calls the Stitch helper function for whichever Stitch auth provider 
	 * your Stitch app is using. 
	 * Change 'stitch.logonWithApiKey' to the function that meets your needs.
	 */
	_onPressLogin() {
		stitch.logonWithApiKey(this.state.client)
		.then(user=>{
			console.log(`Successfully logged in as user ${user.id}`);
			this.setState({ currentUserId: user.id })
		})
		.catch(err=>{
			this.setState({errorState: err.message});
		})
	}

	_onPressLogout() {
		stitch.logout(this.state.client).then(user=>{
			console.log(`Successfully logged out`);
			this.setState({ currentUserId: undefined, results: '', funcResults: '' })
		}).catch(err => {
			console.log(`Failed to log out: ${err}`);
			this.setState({ currentUserId: undefined, results: '', funcResults: '' })
		});
	}

	_onPressGetData() {
		stitch.findAllDocs("HR", "employees").then(result => {
			this.setState({results: JSON.stringify(result, null, 3)});
			this.setState({modalVisible: true});
		})
		.catch(err => {
			console.log(`atlas call failed: ${err}`);
			this.setState({errorState: err});
		})
	}

	_onPressCallFunction() {
		stitch.callFunction(this.state.client, "SayHello", "arg1", "arg2")
		.then(result=>{
			this.setState({funcResults: result});
		})
		.catch(err=>{
			console.log(`function call failed: ${err}`);
			this.setState({errorState: err});
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 50
	},
	title:{
		fontSize:25,
		fontWeight:'bold'
	},
	error: {
		textAlign: 'center',
		color: 'red',
		flexGrow:0.01
	},
	results: {
		textAlign: 'left',
		color: '#066'
	}
});
