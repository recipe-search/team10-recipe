'use strict';

let baseUrl = 'http://localhost:3000';

let idTemporary = '';

$(document).ready(function () {
    auth();
});

const signin = (event) => {
    event.preventDefault();
    $.ajax({
        method: 'post',
        url: baseUrl + '/users/login',
        data: {
            email: $('#email-signin').val(),
            password: $('#password-signin').val(),
        },
    })
        .done((data) => {
            console.log(data);
            localStorage.setItem('token', data.token);
            auth();
        })
        .fail((err) => {
            console.log(err);
        })
        .always((_) => {
            $('#email-signin').val('');
            $('#password-signin').val('');
        });
};

function auth() {
    if (localStorage.token) {
        $('#signup-page').hide();
        $('#signup-success').hide();
        $('#signin-page').hide();
        $('#main-page').show();
        $('#dashboard').show();
        const default_keyword = 'fried chicken';
        $('#container-search-form #keyword').val(default_keyword);
        searchRecipeByKeyword(default_keyword);
    } else {
        $('#signup-page').hide();
        $('#signup-success').hide();
        $('#signin-page').show();
        $('#main-page').hide();
        $('#dashboard').hide();
    }
}

function showSignUpPage() {
    $('#signup-page').show();
    $('#signup-success').hide();
    $('#signin-page').hide();
}
function showSignInPage() {
    $('#signup-page').hide();
    $('#signup-success').hide();
    $('#signin-page').show();
}
function signup(event) {
    event.preventDefault();
    $.ajax({
        method: 'post',
        url: baseUrl + '/users/register',
        data: {
            email: $('#email-signup').val(),
            password: $('#password-signup').val(),
        },
    })
        .done((_) => {
            $('#signup-page').hide();
            $('#signup-success').show();
        })
        .fail((err) => {
            console.log(err.responseJSON.message, '-error');
        })
        .always((_) => {
            $('#email-signup').val('');
            $('#password-signup').val('');
        });
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: `${baseUrl}/users/google`,
        method: 'POST',
        headers: {
            google_token: id_token,
        },
    })
        .done((data) => {
            localStorage.setItem('token', data.token);
            auth();
        })
        .fail((err) => {
            console.log(err);
        });
}
function signout() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear();
        auth();
    });
}

const objToRecipes = (obj) => {
    return obj.map((el, index) => {
        return {
            id: index,
            image: el.recipe.image,
            title: el.recipe.label,
            ingredients: el.recipe.ingredientLines,
            url: el.recipe.url,
        };
    });
};

const recipeTemplate = (recipe) => {
    return `
    <div class="col-sm-4">
        <div class="card mx-0 my-3">
            <img class="card-img-top" src="${recipe.image}" alt="Card image cap" />
            <div class="card-body">
                <h5 class="card-title">${recipe.title}</h5>
                <p class="card-text">
                        ${
                            recipe.ingredients.join(', ').substring(0, 200) +
                            (recipe.ingredients.join(', ').length > 200 ? '...' : '')
                        }
                        <br/>
                        <a href="${recipe.url}">See More</a>
                </p>
                <div style="text-align: right;">
                    <a onclick="getPDF('${recipe.url}')" href="#" class="btn btn-primary btn-sm">PDF</a>
                    <a onclick="sendMail(${recipe.id})" href="#" class="btn btn-primary btn-sm">Mail Me</a>
                </div>
            </div>
        </div>
    </div>
    `;
};

let recipes = null;

const searchRecipe = (event) => {
    event.preventDefault();
    $('#container-search-form #btn-search').addClass('disabled');
    const keyword = $('#container-search-form #keyword').val();
    $.ajax({
        method: 'GET',
        url: 'https://api.edamam.com/search?app_id=cffd9758&app_key=95042006bd05d4e725667accb5ddc84d&q=' + keyword,
    })
        .done((data) => {
            console.log(data.hits);
            if (data.hits) {
                recipes = objToRecipes(data.hits);
                console.log(recipes);
                $('#container-recipes').empty();
                for (let i = 0; i < recipes.length; i++) {
                    $('#container-recipes').append(recipeTemplate(recipes[i]));
                }
            } else {
                console.log('Recipe dengan keyword ini tidak ditemukan!');
            }
        })
        .fail((err) => console.log(err))
        .always(() => $('#container-search-form #btn-search').removeClass('disabled'));
};

const searchRecipeByKeyword = (keyword) => {
    $('#container-search-form #btn-search').addClass('disabled');
    $.ajax({
        method: 'GET',
        url: 'https://api.edamam.com/search?app_id=cffd9758&app_key=95042006bd05d4e725667accb5ddc84d&q=' + keyword,
    })
        .done((data) => {
            console.log(data.hits);
            if (data.hits) {
                recipes = objToRecipes(data.hits);
                console.log(recipes);
                $('#container-recipes').empty();
                for (let i = 0; i < recipes.length; i++) {
                    $('#container-recipes').append(recipeTemplate(recipes[i]));
                }
            } else {
                console.log('Recipe dengan keyword ini tidak ditemukan!');
            }
        })
        .fail((err) => console.log(err))
        .always(() => $('#container-search-form #btn-search').removeClass('disabled'));
};

const sendMail = (id) => {
    let html = `<img src="${recipes[id].image}" height="250">`;
    html += `<p><b>${recipes[id].title}</b></p>`;
    html += `<ul>`;
    for (let i = 0; i < recipes[id].ingredients.length; i++) {
        html += `<li>${recipes[id].ingredients[i]}</li>`;
    }
    html += `</ul>`;
    html += `<a href="${recipes[id].url}">${recipes[id].title}</b>`;

    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/emails/send',
        headers: {
            token: localStorage.token,
        },
        data: {
            subject: recipes[id].title,
            message: html,
        },
    })
        .done((data) => console.log(data))
        .fail((err) => console.log(err));
};

const getPDF = (url) => {
    console.log(url);
    GrabzIt('NjZmOTFlNjRjNGE3NDI5N2FjN2UyNzhiNGU2ZWYwNjY=').ConvertURL(url, { format: 'pdf', download: 1 }).Create();
};
