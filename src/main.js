import axios from "axios";
import simpleLightBox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("form");
const gallery = document.getElementById("gallery");
const loader = document.querySelector(".loader");
const moreButton = document.querySelector(".more-btn");

let currentPage = 1; // geçerli sayfa numarası
let searchQuery = ""; // kullanıcının arayacağı terim
let totalHits = 0; // toplam resim sayısı

// submit butonuna tıklandığında
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    loader.style.display = 'inline'; //loader gözüksün
    moreButton.style.display = 'none'; //more button gizlensin

    searchQuery = document.querySelector(".input").value.trim();

    // arama terimi boşsa
    if (searchQuery === "") {
        loader.style.display = "none";
        iziToast.warning({
            title: 'Caution',
            message: 'The input field cannot be empty. Enter word!',
        });
        return;
    }

    gallery.innerHTML = ""; // önceki sonuçları temizliyoruz
    currentPage = 1; // sayfa numarasını sıfırlıyoruz
    await fetchImages(searchQuery, currentPage); // resimleri fetch ediyoruz
});

// load more butonuna tıklandığında
moreButton.addEventListener("click", async () => {
    if (currentPage * 40 < totalHits) { // daha fazla resim yüklenebilecekse
        currentPage++; // sayfa numarası artıyor
        await fetchImages(searchQuery, currentPage); // yeni resimler fetch edilir
        moreButton.style.display = 'inline';
    } else { // daha fazla resim yoksa
        moreButton.style.display = 'none';
        iziToast.info({
            title: "Info",
            message: "We're sorry, but you've reached the end of search results.",
        });
    }
});

async function fetchImages(search, page) {
    try {
        const { data } = await axios.get("https://pixabay.com/api/", {
            params: {
                key: "49387941-e00fdaa64f5dbf31f27188f8a",
                q: search,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
                per_page: 40,
            },
        });
        totalHits = data.totalHits;
        loader.style.display = 'none';

        if (data.hits.length === 0) { // resim yoksa
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again!',
            });
        } else { // resim varsa
            gallery.innerHTML += data.hits.map(image => `
                <div class="gallery-cont">
                    <a class="gallery-a" href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" /></a>
                    <div class="gallery-info">
                        <div class="info-item">
                            <p>Likes</p>
                            <p>${image.likes}</p>  
                        </div>  
                        <div class="info-item">  
                            <p>Views</p>  
                            <p>${image.views}</p>  
                        </div>  
                        <div class="info-item">  
                            <p>Comments</p>  
                            <p>${image.comments}</p>  
                        </div>  
                        <div class="info-item">  
                            <p>Downloads</p>  
                            <p>${image.downloads}</p>  
                        </div>  
                    </div>
                </div>
                `).join("");
            moreButton.style.display = "inline";

            // sayfa kaydırma işlemi
            const lastImageCard = document.querySelector(".gallery-cont:last-child"); // son eklenen resim kartını aldık
            const { height } = lastImageCard.getBoundingClientRect(); //kartın yüksekliğini aldık
            window.scrollBy({ // sayfayı yukarı kaydırıyoruz
                top: height * 2, // 2 kart yüksekliği kadar kaydırıyoruz
                behavior: 'smooth'
            });
        }

        // SimpleLightbox işleme
        const lightbox = new simpleLightBox('.gallery-a', {
            captionsData: 'alt',
            captionDelay: 250,
        });
        lightbox.refresh(); // yeni resimler yüklendikten sonra lightbox'ı güncelliyoruz
    } catch (error) {
        loader.style.display = 'none';
        console.error(error);
        iziToast.error({
            title: 'Hata',
            message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin!", // API çağrısı sırasında hata olursa (fetch işlemi sırasında)
        });
    }

}
