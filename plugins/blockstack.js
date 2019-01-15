//This was meant to be for blockstack but then it got out of hand so i'll just leave it like this ty
import Vue from "vue";
import * as blockstack from "blockstack";

export default {
  blockstack
}

const sortByKey = (arr, key) => {
  return arr.sort(function (a, b) {
    var x = parseInt(Object.values(a)[0][key]);
    var y = parseInt(Object.values(b)[0][key]);
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
}

const arrayToObj = (arr) => {
  let newObj = {};
  for (var i = 0; i < arr.length; i++) {
    let key = Object.keys(arr[i])[0];
    newObj[key] = arr[i][key];
  }
  return newObj;
}

const objToArr = (obj) => {
  return Object.keys(obj).map(function (key) {
    return {
      [key]: obj[key]
    };
  });
}

export const sortPostsByDate = (obj) => {
  let arr = objToArr(obj);
  arr = sortByKey(arr, "updated");
  obj = arrayToObj(arr);
  return obj;
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

const lookupProfileInternal = (handle) => {
  return new Promise((resolve, reject) => {
    blockstack.lookupProfile(String(handle)).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
}

const getPostCountInternal = (posts = []) => {
  return objToArr(posts).length;
}

export const getPostCount = getPostCountInternal;

export const lookupProfile = lookupProfileInternal;

export const search = (handle) => {
  return new Promise((resolve, reject) => {
    handle = String(handle).toLowerCase().replace(/\s/g, "");
    if (handle.substr(handle.length - 14, handle.length) == ".id.blockstack" || handle.substr(handle.length - 3, handle.length) == ".id") {
      lookupProfileInternal(handle).then((res) => {
        if (res) {
          res.handle = handle;
          resolve(res);
        } else {
          resolve(false);
        }
      }).catch((err) => {
        reject(err);
      });
    } else {
      let newHandle = handle + ".id.blockstack";
      lookupProfileInternal(newHandle).then((res) => {
        if (res) {
          res.handle = newHandle;
          resolve(res);
        } else {
          newHandle = handle + ".id";
          lookupProfileInternal(newHandle).then((res) => {
            if (res) {
              res.handle = newHandle;
              resolve(res);
            } else {
              resolve(false);
            }
          }).catch((err) => {
            reject(err);
          });
        }
      }).catch((err) => {
        reject(err);
      })
    }
  });
}

const getFileContentsInternal = (file = "options.json", user = null, isPrivate = false) => {
  return new Promise((resolve, reject) => {
    let opts;
    if (isPrivate) {
      opts = {
        decrypt: true,
        verify: true
      };
    } else {
      opts = {
        decrypt: false,
        verify: false
      };
    }
    if (user) {
      opts.username = String(user);
    }
    blockstack.getFile(String(file), opts).then((res) => {
      if (res) {
        res = JSON.parse(res);
        resolve(res);
      } else {
        resolve({});
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

export const getFileContents = getFileContentsInternal;


const putFileContentsInternal = (file = "options.json", content, isPrivate = false) => {
  return new Promise((resolve, reject) => {
    let opts;
    if (isPrivate) {
      opts = {
        encrypt: true,
        sign: true
      };
    } else {
      opts = {
        encrypt: false
      };
    }
    blockstack.putFile(String(file), JSON.stringify(content), opts).then((res) => {
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

export const deletePost = (slug, file = "posts.json", isPrivate = false) => {
  return new Promise((resolve, reject) => {
    getFileContentsInternal(file, null, isPrivate).then((posts) => {
      if (typeof posts == "string") {
        posts = JSON.parse(posts);
      }
      slug = String(slug);
      delete posts[slug];
      putFileContentsInternal(file, posts, isPrivate).then((res) => {
        resolve({
          "posts": posts,
          "file": file,
          "res": res
        });
      }).catch((err) => {
        reject(err);
      });
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
      getFileContentsInternal("drafts.json", null, true).then((drafts) => {
        if (typeof drafts == "string") {
          drafts = JSON.parse(drafts);
        }
        drafts[slug] = {
          "title": title,
          "content": content,
          "updated": Date.now(),
          "draft": true
        };
        putFileContentsInternal("drafts.json", JSON.stringify(drafts), true).then((res) => {
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
    getFileContentsInternal("options.json").then((res) => {
      if (res) {
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

var generateSlug = (str, update = false, slug = null) => {
  return new Promise((resolve, reject) => {
    if (update && slug) {
      resolve(String(slug));
    } else {
      let taken = true;
      let int = 0;
      let attempts = 0;
      if (str.substr(0, 6).toLowerCase() == "draft-") {
        str = str.substr(6, str.length);
      }
      str = cleanseForSlug(str);
      while (taken && attempts < 5) {
        attempts++;
        getFileContentsInternal("posts.json").then((res) => {
          if (res && !update) {
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
    if (!slug) {
      reject("No slug provided");
    }
    posts = posts || {};
    posts[slug] = posts[slug] || {};
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
  });
}

export const toast = (title, type = "success") => {
  let toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    customClass: "mixin",
    timer: 3000
  });
  return toast({
    type: String(type),
    title: String(title),
    background: "#2B2C31"
  });
}

export const deleteAll = () => {
  blockstack.putFile("posts.json", "", {
    encrypt: false
  });
  blockstack.putFile("options.json", "", {
    encrypt: false
  });
  blockstack.putFile("drafts.json", "", {
    encrypt: true,
    sign: true
  });
}

const cleanseForSlug = (slug) => {
  return String(slug).replace(/[`~!@#$%^&*£()_|+=?;:€'",¬.<>\{\}\[\]\\\/]/gi, "").replace(/\s+/g, "-").toLowerCase();
}

export const changeSlug = (oldSlug, newSlug) => {
  return new Promise((resolve, reject) => {
    getFileContentsInternal("posts.json").then((posts) => {
      if (posts[oldSlug]) {
        newSlug = cleanseForSlug(newSlug);
        posts[newSlug] = posts[oldSlug];
        delete posts[oldSlug];
        putFileContentsInternal("posts.json", posts).then((res) => {
          resolve({
            res: res,
            slug: newSlug
          });
        }).catch((err) => {
          reject(err);
        });
      } else {
        reject("A post with the original slug of" + oldSlug + "was not found.");
      }

    }).catch((err) => {
      reject(err);
    })
  });
}

export const updatePost = (content, title = null, slug = null, update = false) => {
  return new Promise((resolve, reject) => {
    let originalTitle = String(title) || "";
    getFileContentsInternal("posts.json").then((posts) => {
      getTitleFromContent(content, title).then((title) => {
        generateSlug(title, update, slug).then((slug) => {
          savePost(content, title, slug, posts).then((res) => {
            if (res) {
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

export const sound = (dest) => {
  dest = String(dest);
  let audio = new Audio(`https://cdn.chae.sh/audio/${dest}`);
  audio.play();
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
  vm.prototype.$deletePost = deletePost;
  vm.prototype.$sound = sound;
  vm.prototype.$sortPostsByDate = sortPostsByDate;
  vm.prototype.$toast = toast;
  vm.prototype.$search = search;
  vm.prototype.$getPostCount = getPostCount;
  vm.prototype.$changeSlug = changeSlug;
  vm.prototype.$putFile = putFileContentsInternal;
});
