/*
Keith Dolle 
INF 651
December 9, 2024
*/

// Function 1

function createElemWithText(elementType = "p", textContent = "", className) {

    const element = document.createElement(elementType);
    
    element.textContent = textContent;
    
    if (className) {
        element.className = className;
    }
    
    return element;
}

// Function 2

function createSelectOptions(users) {

    if (!users) return undefined;

    const options = [];

    users.forEach(user => {

        const option = document.createElement("option");
        
        option.value = user.id;
        
        option.textContent = user.name;
        
        options.push(option);

    });

    return options;
}

// Function 3

function toggleCommentSection(postId) {
    if (!postId) return undefined;

    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    
    if (section) {
        section.classList.toggle('hide');
    }
    
    return section;
}


// Function 4

function toggleCommentButton(postId) {
    if (!postId) return undefined;

    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    
    if (button) {
        button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    }
    
    return button;
}


// Function 5

function deleteChildElements(parentElement) {

    if (!(parentElement instanceof HTMLElement)) return undefined;

    let child = parentElement.lastElementChild;
    
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    
    return parentElement;
}


// Function 6

function addButtonListeners() {

    const buttons = document.querySelectorAll('main button');
    
    if (buttons) {

        buttons.forEach(button => {
            const postId = button.dataset.postId;
            
            if (postId) {
                button.addEventListener('click', (event) => {
                    toggleComments(event, postId);
                });
            }
        });
    }

    return buttons;
}

// Function 7

function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    
    if (buttons) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;
            if (postId) {
                button.removeEventListener('click', (event) => {
                    toggleComments(event, postId);
                });
            }
        });
    }

    return buttons;
}

// Function 8

function createComments(comments) {
    if (!comments) return undefined;
    const fragment = document.createDocumentFragment();

    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const p1 = createElemWithText('p', comment.body);
        const p2 = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, p1, p2);
        fragment.appendChild(article);
    });

    return fragment;
}

// Function 9

function populateSelectMenu(users) {

    if (!users) return undefined;
    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);

    options.forEach(option => {
        selectMenu.appendChild(option);
    });
    
    return selectMenu;
}


// Function 10

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function 11

async function getUserPosts(userId) {

    if (!userId) return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}


// Function 12

async function getUser(userId) {

    if (!userId) return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


// Function 13

async function getPostComments(postId) {

    if (!postId) return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = await response.json();
        return comments;
    } catch (error) {
        console.error('Error fetching post comments:', error);
    }
}


// Function 14

async function displayComments(postId) {

    if (!postId) return undefined;
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    
    return section;
}


// Function 15

async function createPosts(posts) {

    if (!posts) return undefined;
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
        
        article.appendChild(section);
        
        fragment.appendChild(article);
    }

    return fragment;
}



// Function 16

async function displayPosts(posts) {
    const main = document.querySelector('main');
    const element = posts ? await createPosts(posts) : createElemWithText('p', 
        'Select an Employee to display their posts.', 'default-text');
    main.appendChild(element);

    return element;
}


// Function 17

function toggleComments(event, postId) {

    if (!event || !postId) return undefined;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

// Function 18

async function refreshPosts(posts) {
    if (!posts) return undefined;
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    
    return [removeButtons, main, fragment, addButtons];
}

// Function 19

async function selectMenuChangeEventHandler(event) {
    
    if (!event) return undefined;
    event.target.disabled = true;
    
    const userId = event.target.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);

    event.target.disabled = false;

    return [userId, posts, refreshPostsArray];
}

// Function 20

async function initPage() {

    const users = await getUsers();
    const select = populateSelectMenu(users);

    return [users, select];
}

// Function 21

function initApp() {
    initPage();
    
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);
