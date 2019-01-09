import Vue from "vue";
import * as blockstack from "blockstack";

export default {
  blockstack
}

export const signIn = () => {
  let origin = window.location.origin;
  blockstack.redirectToSignIn(origin + "/login", origin + "/manifest.json", ['store_write', 'publish_data']);
};

export const requireSignIn = (router) => {
  return new Promise((resolve, reject) => {
    if (blockstack.isUserSignedIn()) {
      let username = localStorage.getItem("username");
      if (!username) {
        let data = blockstack.loadUserData();
        username = data.username;
        localStorage.setItem("username", data.username);
        sessiolocalStoragenStorage.setItem("userData", JSON.stringify(data));
        resolve(username);
      } else {
        resolve(username);
      }

    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then((data) => {
        let username = localStorage.getItem("username");
        if (!username) {
          username = data.username;
          localStorage.setItem("username", data.username);
          localStorage.setItem("userData", JSON.stringify(data));
          resolve(username);
        } else {
          resolve(username);
        }
      });
    } else {
      console.log("[DEBUG] User not logged in, redirecting from restricted page.");
      router.push("/login");
      resolve(false);
    }
  });

}

export const signout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("userData");
  blockstack.signUserOut(window.location.origin + "/login");
}

export const lookupProfile = (handle) => {
  return new Promise((resolve, reject) => {
    blockstack.lookupProfile(handle).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
}

const getFileContentsInternal = (file = "options.json", user = null) => {
  return new Promise((resolve, reject) => {
    let opts = {};
    if (user) {
      opts.username = String(user);
      opts.decrypt = false;
    }
    blockstack.getFile(String(file), opts).then((res) => {
      resolve(JSON.parse(res));
    }).catch((err) => {
      reject(err);
    });
  });
}

export const getFileContents = getFileContentsInternal;


const putFileContentsInternal = (file = "options.json", content, isPrivate = false) => {
  return new Promise((resolve, reject) => {
    let opts = {
      encrypt: false
    };
    blockstack.putFile(String(file), content, opts).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
}

export const putFileContents = putFileContentsInternal;

export const characterCounter = (e) => {
  return e.target.value.length;
}

export const getProfile = (onlyProfile = true) => {
  if (onlyProfile) {
    return blockstack.loadUserData().profile;
  } else {
    return blockstack.loadUserData();
  }
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
    blockstack.putFile("options.json", JSON.stringify(obj), {
      encrypt: false
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
}


export const saveDraft = (content, title = null, slug = null) => {
  return new Promise((resolve, reject) => {
    let originalTitle = title;
    getTitleFromContent(content, title).then((title) => {
      if (!slug) {
        slug = uuid();
      }
      let slug = `draft-${slug}`;
      blockstack.getFile("drafts.json", {
        verify: false,
        decrypt: false
      }).then((drafts) => {
        if (drafts) {
          drafts = JSON.parse(drafts);
        } else {
          drafts = {};
        }
        drafts[slug] = {
          "title": title,
          "content": content,
          "updated": Date.now()
        };
        blockstack.putFile("drafts.json", JSON.stringify(drafts), {
          encrypt: false
        }).then((res) => {
          if (originalTitle == title) {
            resolve({
              "slug": slug,
              "res": res
            });
          } else {
            resolve({
              "slug": slug,
              "title": title,
              "res": res
            });
          }

        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      })
    });
  });
}

export const getOptions = (key = null) => {
  return new Promise((resolve, reject) => {
    blockstack.getFile("options.json", {
      verify: false,
      decrypt: false
    }).then((res) => {
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

var generateSlug = (str, posts, update) => {
  return new Promise((resolve, reject) => {
    let taken = true;
    let int = 0;
    let attempts = 0;
    if (str.substr(0, 6).toLowerCase() == "draft-") {
      str = str.substr(6, str.length);
    }
    str = str.replace(/[`~!@#$%^&*£()_|+=?;:€'",¬.<>\{\}\[\]\\\/]/gi, '');
    str = str.toLowerCase().replace(/\s+/g, '-');
    while (taken && attempts < 5) {
      attempts++;
      blockstack.getFile("posts.json", {
        verify: false,
        decrypt: false
      }).then((res) => {
        if (res && !update) {
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
  return String(uuid);
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
      posts = [];
    }
    if (!posts[slug]) {
      posts[slug] = {};
    }
    posts[slug] = {
      "title": title,
      "content": content,
      "updated": Date.now()
    };
    blockstack.putFile("posts.json", JSON.stringify(posts), {
      encrypt: false
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

export const deleteAll = () => {
  blockstack.putFile("posts.json", "", {
    encrypt: false
  });
  blockstack.putFile("options.json", "", {
    encrypt: false
  });
  blockstack.putFile("drafts.json", "", {
    encrypt: false
  });
}

export const updatePost = (content, title = null, slug = null, update = false) => {
  return new Promise((resolve, reject) => {
    let originalTitle = String(title) || "";
    blockstack.getFile("posts.json", {
      verify: false,
      decrypt: false
    }).then((posts) => {
      if (posts) {
        posts = JSON.parse(posts);
      } else {
        posts = {};
      }
      getTitleFromContent(content, title).then((title) => {
        generateSlug(title, posts, update).then((slug) => {
          savePost(content, title, slug, posts).then((res) => {
            if (res) {
              console.log(`[DEBUG] Saved post under the slug ${slug}`);
              if (originalTitle && originalTitle.toLowerCase() == title && originalTitle != "") {
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
  vm.prototype.$saveDraft = saveDraft
  vm.prototype.$signOut = signout;
  vm.prototype.$getFileContents = getFileContents;
  vm.prototype.$deleteAll = deleteAll;
});
