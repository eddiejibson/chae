import Vue from "vue";
import * as blockstack from "blockstack";
import {
  promised
} from "q";

export default {
  blockstack
}

export const signIn = () => {
  let origin = window.location.origin;
  blockstack.redirectToSignIn();
};

export const requireSignIn = (router) => {
  return new Promise((resolve, reject) => {
    if (blockstack.isUserSignedIn()) {
      console.log("sex")
      resolve(true);
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(() => {
        resolve(true);
      });
    } else {
      console.log("[DEBUG] User not logged in, redirecting from restricted page.");
      router.push("/login");
      resolve(false);
    }
  });

}

export const characterCounter = (e) => {
  return e.target.value.length;
}

export const getProfile = () => {
  return blockstack.loadUserData().profile;
}

export const lookupProfile = (user) => {
  blockstack.lookupProfile(user).then(profile => {
    console.log(profile);
  });
}

export const saveOptions = ({
  bio
}) => {
  return new Promise((resolve, reject) => {
    let obj = {
      "bio": bio.target.value.toString()
    };
    console.log(obj);
    blockstack.putFile("options.json", JSON.stringify(obj)).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  });
}


export const getOptions = (key = null) => {
  return new Promise((resolve, reject) => {
    blockstack.getFile("options.json").then((res) => {
      if (res) {
        res = JSON.parse(res);
        if (key) {
          resolve(res[key])
        } else {
          resolve(res);
        }
      } else {
        resolve(false);
      }
    }).catch((err) => {
      reject(err);
    })
  })
}

export const test = (e) => {
  console.log(e.target.value);
  e.target.value = "Shit.";
}

export const test2 = () => {
  return true;
}

Vue.use((vm) => {
  if (vm.__blockstack_installed__) return
  vm.prototype.$blockstack = {
    blockstack
  }
  vm.prototype.$signIn = signIn
  vm.prototype.$getProfile = getProfile
  vm.prototype.$requireSignIn = requireSignIn
  vm.prototype.$lookupProfile = lookupProfile
  vm.prototype.$characterCounter = characterCounter
  vm.prototype.$saveOptions = saveOptions
  vm.prototype.$getOptions = getOptions
})
