function createElemWithText(
    elemName = "p",
    elemTextContent = "",
    className = ""
  ) {
    let newElemWithText = document.createElement(elemName);
    newElemWithText.textContent = elemTextContent;
    newElemWithText.className = className;
    return newElemWithText;
  }
  
  function createSelectOptions(users) {
    if (users === undefined || users === null) {
      return undefined;
    }
  
    let optionArray = [];
  
    for (let user of users) {
      console.log(user);
  
      let opt = document.createElement("option");
      opt.value = user.id;
      opt.innerHTML = user.name;
      optionArray.push(opt);
    }
    return optionArray;
  }
  
  function toggleCommentSection(postId) {
    if (!postId) {
      return undefined;
    } else {
      const commentSections = document.querySelectorAll("[data-post-id]");
      for (let i = 0; i < commentSections.length; i++) {
        const commentSection = commentSections[i];
        if (commentSection.getAttribute("data-post-id") == postId) {
          commentSection.classList.toggle("hide");
          return commentSection;
        }
      }
  
      return null;
    }
  }
  
  function toggleCommentButton(postID) {
    if (!postID) {
      return;
    }
  
    const btnSelectedEl = document.querySelector(
      `button[data-post-id = "${postID}"`
    );
  
    if (btnSelectedEl != null) {
      btnSelectedEl.textContent === "Show Comments"
        ? (btnSelectedEl.textContent = "Hide Comments")
        : (btnSelectedEl.textContent = "Show Comments");
    }
  
    return btnSelectedEl;
  }
  
  function deleteChildElements(param) {
    if (!param || !param.nodeType) {
      return undefined;
    }
    let child = param.lastElementChild;
  
    while (child) {
      param.removeChild(child);
  
      child = param.lastElementChild;
    }
  
    return param;
  }
  
  function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.addEventListener("click", () => {
        toggleComments(event, postId);
      });
    });
  
    return buttons;
  }
  
  function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    let x = [];
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.removeEventListener("click", () => {
        toggleCommentButton(button).click[0].listener;
      });
    });
  
    return buttons;
  }
  
  function createComments(comments) {
    if (!comments) {
      return undefined;
    }
    let frag = document.createDocumentFragment();
  
    for (let i = 0; i < comments.length; i++) {
      const element = comments[i];
  
      let a = document.createElement("Article");
  
      let h3 = createElemWithText("h3", element.name);
  
      let p1 = createElemWithText("p", element.body);
  
      let p2 = createElemWithText("p", `From: ${element.email}`);
  
      a.appendChild(h3);
      a.appendChild(p1);
      a.appendChild(p2);
  
      frag.appendChild(a);
    }
  
    return frag;
  }
  
  function populateSelectMenu(users) {
    if (!users) return;
  
    let menu = document.querySelector("#selectMenu");
  
    let options = createSelectOptions(users);
  
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      menu.append(option);
    }
  
    return menu;
  }
  
  let getUsers = async () => {
    let retrieve;
  
    try {
      retrieve = await fetch("https://jsonplaceholder.typicode.com/users");
    } catch (error) {
      console.log(error);
    }
  
    return await retrieve.json();
  };
  
  let getUserPosts = async (userId) => {
    if (!userId) return;
  
    let retrieve;
  
    try {
      retrieve = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}/posts`
      );
    } catch (error) {
      console.log(error);
    }
  
    return retrieve.json();
  };
  
  let getUser = async (userId) => {
    if (!userId) return;
  
    let retrieve;
  
    try {
      retrieve = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
    } catch (error) {
      console.log(error);
    }
  
    return retrieve.json();
  };
  
  let getPostComments = async (postId) => {
    if (!postId) return;
      
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      return response.json();
      
    } catch (error) {
      console.log(error);
      return;
    }
  
  };
  
  const displayComments = async(postId) => {
    if(!postId) return;
    const element = document.createElement("section");
    element.dataset.postId = postId;
    element.classList.add("comments","hide");
  
    
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    if(!comments) return;
    
    element.append(fragment);
    console.log(element);
    return element;
  }
  
  async function createPosts(posts) {
      if(!posts) return;
      const fragment = document.createDocumentFragment();
      for (const post of posts) {
          const article = document.createElement('article');
          const h2 = createElemWithText('h2', post.title);
          const p1 = createElemWithText('p', post.body);
          const p2 = createElemWithText('p', `Post ID: ${post.id}`);
          const author = await getUser(post.userId);
          const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
          const p4 = createElemWithText('p', author.company.catchPhrase);
          const button = createElemWithText('button', 'Show Comments');
          button.dataset.postId = post.id;
          article.append(h2, p1, p2, p3, p4, button);
          const section = await displayComments(post.id);
          article.append(section);
          fragment.append(article);
      }
      return fragment;
  }
  
  const displayPosts = async (posts) => {
    let myMain = document.querySelector("main");
    let element = posts
      ? await createPosts(posts)
      : document.querySelector("main p");
    myMain.append(element);
    return element;
  };
  
  function toggleComments(event, postId) {
    if (!event || !postId) {
      return undefined;
    }
    event.target.listener = true;
    let section = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);
    return [section, button];
  }
  
  const refreshPosts = async (posts) => {
    if (!posts) {
      return undefined;
    }
    let buttons = removeButtonListeners();
    let myMain = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let button = addButtonListeners();
    return [buttons, myMain, fragment, button];
  };
  
  const selectMenuChangeEventHandler = async (e) => {
    if (!e) return;
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
  };
  
  const initPage = async () => {
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
  };
  
  function initApp() {
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
  }
  
  document.addEventListener("DOMContentLoaded", initApp, false);
  