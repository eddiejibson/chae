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
      "bio": {
        "content": bio.target.value.toString(),
        "updated": Date.now()
      }
    };
    blockstack.putFile("options.json", JSON.stringify(obj)).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
}


export const saveDraft = (content, title = null) => {
  if (!title) {
    getTitleFromContent(content).then((title) => {

    })
  }
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

var generateSlug = (str, posts) => {
  return new Promise((resolve, reject) => {
    let taken = true;
    let int = 0;
    let attempts = 0;
    str = str.toLowerCase().replace(/\s+/g, '-');
    while (taken && attempts < 5) {
      attempts++;
      blockstack.getFile("posts.json").then((res) => {
        if (res) {
          res = JSON.parse(res);
          if (!res[str]) {
            resolve(str);
            taken = false;
          } else {
            int++;
            str = `${str}-${int}`;
          }
        } else {
          resolve(str);
        }
      }).catch((err) => {
        reject(err);
      });
    }
  });
}

var uuid = () => {
  var uuid = "",
    i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

var getTitleFromContent = (content, title = null) => {
  return new Promise((resolve, reject) => {
    if (!title) {
      let x = content;
      let y = x.split(" ");
      if (y.length < 10) {
        let res = y.join(" ");
        resolve(res);
      } else {
        let res = y.splice(0, 10).join(" ");
        resolve(res);
      }
    } else {
      resolve(title);
    }

  });
}

var savePost = (content, title, slug, posts) => {
  return new Promise((resolve, reject) => {
    if (!posts) {
      posts = {};
    }
    if (!posts[slug]) {
      posts[slug] = {};
    }
    posts[slug] = {
      "title": title,
      "content": content,
      "updated": Date.now()
    };
    blockstack.putFile("posts.json", JSON.stringify(posts)).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}


export const updatePost = (content = null, title = null, slug = null) => {
  return new Promise((resolve, reject) => {
    if (!content) {
      reject("Content not provided");
    } else {
      let originalTitle = title;
      blockstack.getFile("posts.json").then((posts) => {
        posts = JSON.parse(posts);
        getTitleFromContent(content, title).then((title) => {
          generateSlug(title, posts).then((slug) => {
            savePost(content, title, slug, posts).then((res) => {
              if (res) {
                console.log(`[DEBUG] Saved post under the slug ${slug}`);
                if (originalTitle.toLowerCase() == title) {
                  resolve({
                    "slug": slug,
                    "res": res
                  });
                } else {
                  resolve({
                    "title": title,
                    "slug": slug,
                    "res": res
                  });
                }

              } else {
                reject("Couldn't save post...");
              }
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        });
      }).catch((err) => {
        reject(err);
      });
    }
  });


}

export const lastEdited = (time) => {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = Date.now() - parseInt(time);
  if (elapsed < msPerMinute) {
    return "Just now."
    /*  return Math.round(elapsed/1000) + ' seconds ago';    */
  } else if (elapsed < msPerHour) {
    let res = Math.round(elapsed / msPerMinute);
    let s = "s";
    if (res == 1) {
      s = "";
    }
    return `${res} minute${s} ago.`;
  } else if (elapsed < msPerDay) {
    let res = Math.round(elapsed / msPerHour);
    let s = "s";
    if (res == 1) {
      s = "";
    }
    return `${res} hour${s} ago.`;
  } else if (elapsed < msPerMonth) {
    let res = Math.round(elapsed / msPerDay);
    let s = "s";
    if (res == 1) {
      s = "";
    }
    return `${res} day${s} ago.`;
  } else if (elapsed < msPerYear) {
    let res = Math.round(elapsed / msPerMonth);
    let s = "s";
    if (res == 1) {
      s = "";
    }
    return `${res} month${s} ago.`;
  } else {
    let res = Math.round(elapsed / msPerYear);
    let s = "s";
    if (res == 1) {
      s = "";
    }
    return `${res} year${s} ago`;
  }

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
  vm.prototype.$lastEdited = lastEdited
  vm.prototype.$updatePost = updatePost
})
