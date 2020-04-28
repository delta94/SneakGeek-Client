import { Dimensions, StyleSheet } from "react-native";
import { themes } from "@resources";

export const styles = StyleSheet.create({
  rootContainer: { backgroundColor: 'white', flex: 1 },
  searchBarRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: 'transparent',
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  dropDownContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    maxHeight: Dimensions.get('window').height / 3,
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: themes.DisabledColor,
    paddingBottom: 10,
    paddingHorizontal: 10,
    zIndex: 100,
    backgroundColor: 'white',
  },
  thumbnail: {
    width: 60,
    height: 40,
  },
  productNotFound: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    height: (themes.RegularButtonHeight * 2) / 3,
    borderTopColor: themes.AppPrimaryColor,
    borderBottomColor: themes.AppPrimaryColor,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 100,
  },
  filterTitle: {
    margin: 15,
    color: 'white',
  },
  chipContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: themes.AppDisabledColor,
    maxWidth: 200,
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomColor: themes.DisabledColor,
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  }
});