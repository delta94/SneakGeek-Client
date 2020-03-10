import * as React from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { themes, strings } from '@resources';
import { BottomButton, AppText, DismissKeyboardView } from '@screens/Shared';
import RouteNames from 'navigations/RouteNames';
import { connect } from 'react-redux';
import { authenticateWithEmail, NetworkRequestState, Account } from 'business';
import { IAppState } from '@store/AppStore';
import { showErrorNotification, toggleIndicator } from 'actions';

type State = {
  email: string;
  password: string;
};

type Props = {
  accountState: {
    state: NetworkRequestState;
    error?: any;
    account?: Account;
  };
  navigation: StackNavigationProp<any>;

  toggleLoadingIndicator: (isLoading: boolean, message?: string) => void;
  showErrorNotification: (message: string) => void;
  emailLogin: (email: string, password: string) => void;
};

@connect(
  (state: IAppState) => ({
    accountState: state.UserState.accountState,
  }),
  (dispatch: Function) => ({
    toggleLoadingIndicator: (isLoading: boolean, message?: string) => {
      dispatch(toggleIndicator({ isLoading, message }));
    },
    showErrorNotification: (message: string) => {
      dispatch(showErrorNotification(message));
    },
    emailLogin: (email: string, password: string) => {
      dispatch(authenticateWithEmail(email, password));
    },
  }),
)
export class EmailLoginScreen extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  public componentDidUpdate(prevProps: Props) {
    const { accountState, showErrorNotification, toggleLoadingIndicator } = this.props;
    const { state } = accountState;
    if (state === prevProps.accountState.state ) 
      return;
    
    toggleLoadingIndicator(state === NetworkRequestState.REQUESTING);

    switch (state) {
      case NetworkRequestState.FAILED:
        showErrorNotification(strings.InvalidLogin);
        break;
      case NetworkRequestState.REQUESTING:
        break;
      case NetworkRequestState.SUCCESS:
        break;
      default:
        break;
    }
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle={'dark-content'} />
        <DismissKeyboardView style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 40 }}>
              {this._renderEmail()}
              {this._renderPassword()}
              {this._renderForgot()}
            </View>
          </View>
          {this._renderButton()}
        </DismissKeyboardView>
      </SafeAreaView>
    );
  }

  private _renderEmail(): JSX.Element {
    const { email } = this.state;
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={strings.Email}
          value={email}
          onChangeText={email => this.setState({ email })}
          selectionColor={themes.AppPrimaryColor}
          autoCapitalize={'none'}
        />
      </View>
    );
  }

  private _renderPassword() {
    const { password } = this.state;
    return (
      <View style={styles.inputContainer}>
        <TextInput
          autoFocus={true}
          style={styles.input}
          placeholder={strings.Password}
          value={password}
          onChangeText={password => this.setState({ password })}
          selectionColor={themes.AppPrimaryColor}
          secureTextEntry={true}
          autoCapitalize={'none'}
        />
      </View>
    );
  }

  private _renderForgot(): JSX.Element {
    const { navigation } = this.props;
    return (
      <AppText.Body
        style={styles.forgotContainer}
        onPress={() => navigation.navigate(RouteNames.Auth.ForgotPassword)}
      >
        {strings.ForgotPassword}
      </AppText.Body>
    );
  }

  private _renderButton(): JSX.Element {
    const { email, password } = this.state;

    return (
      <BottomButton
        title={strings.SignIn}
        onPress={() => this.props.emailLogin(email, password)}
        style={{ backgroundColor: themes.AppPrimaryColor }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
  },
  title: {
    lineHeight: 25,
    textAlign: 'left',
    paddingLeft: 42,
  },
  inputContainer: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginVertical: 5,
  },
  absolute: {
    position: 'absolute',
    left: 12,
    top: -7,
    backgroundColor: 'white',
  },
  input: {
    fontFamily: 'Roboto',
    fontSize: 16,
    flex: 1,
  },
  forgotContainer: {
    marginTop: 25,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
