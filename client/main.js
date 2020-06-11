'use strict';

$(document).ready(() => {});

const baseUrl = 'http://localhost:3000';

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

const sendMail = (id) => {
    let html = `<img src="${recipes[id].image}" height="250">`;
    html += `<p><b>${recipes[id].title}</b></p>`;
    html += `<ul>`;
    for (let i = 0; i < recipes[id].ingredients.length; i++) {
        html += `<li>${recipes[id].ingredients[i]}</li>`;
    }
    html += `</ul>`;
    html += `<a href="${recipes[id].url}">${recipes[id].title}</b>`;
    console.log(html, recipes[id].url);
    $.ajax({
        method: 'GET',
        url: 'https://pdfmyurl.com/api?license=yourlicensekey&url=' + recipes[id].url,
    })
        .done((data) => console.log(data))
        .fail((err) => console.log(err));
};
