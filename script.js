// --- GLOBAL STATE ---
const baseProducts = [
    { 
        baseId: 9, 
        category: 'Spices & Masalas', 
        name: 'Black Pepper Powder', 
        // 🌐 Replace with the actual URL after uploading the image
        img:'https://res.cloudinary.com/drmgywvk0/image/upload/v1762251965/blackpepper_rfpc63.webp', 
        variants: [
            { id: '9-100g', size: '100g', price: 120 },
            { id: '9-250g', size: '250g', price: 250 },
            { id: '9-500g', size: '500g', price: 450 },
            { id: '9-1kg', size: '1kg', price: 800 },
        ]
    },
    { 
        baseId: 10, 
        category: 'Spices & Masalas', 
        name: 'Red Chilli Powder', 
        img: 'https://res.cloudinary.com/drmgywvk0/image/upload/w_500,h_500,c_fill/v1762251965/red-chilli-powder.webp',
        variants: [
            { id: '10-100g', size: '100g', price: 150 },
            { id: '10-250g', size: '250g', price: 350 },
            { id: '10-500g', size: '500g', price: 650 },
            { id: '10-1kg', size: '1kg', price: 1200 },
        ]
    },
    { 
        baseId: 11, 
        category: 'Spices & Masalas', 
        name: 'Turmeric Powder', 
        img: 'https://placehold.co/100x100/FFCC00/000?text=TUR',
        variants: [
            { id: '11-100g', size: '100g', price: 80 },
            { id: '11-250g', size: '250g', price: 180 },
            { id: '11-500g', size: '500g', price: 320 },
            { id: '11-1kg', size: '1kg', price: 600 },
        ]
    },
    { 
        baseId: 12, 
        category: 'Spices & Masalas', 
        name: 'Sambar Powder', 
        img: 'https://placehold.co/100x100/FF6347/fff?text=SAM',
        variants: [
            { id: '12-100g', size: '100g', price: 180 },
            { id: '12-250g', size: '250g', price: 400 },
            { id: '12-500g', size: '500g', price: 750 },
            // 1kg variant omitted for complexity/size
        ]
    },
    { 
        baseId: 13, 
        category: 'Spices & Masalas', 
        name: 'Coriander Powder', 
        img: 'https://placehold.co/100x100/3CB371/fff?text=COR',
        variants: [
            { id: '13-100g', size: '100g', price: 95 },
            { id: '13-250g', size: '250g', price: 220 },
            { id: '13-500g', size: '500g', price: 400 },
            { id: '13-1kg', size: '1kg', price: 750 },
        ]
    },
    { 
        baseId: 14, 
        category: 'Spices & Masalas', 
        name: 'Rasam Powder', 
        img: 'https://placehold.co/100x100/FFA07A/fff?text=RAS',
        variants: [
            { id: '14-100g', size: '100g', price: 130 },
            { id: '14-250g', size: '250g', price: 290 },
            { id: '14-500g', size: '500g', price: 550 },
        ]
    },
    { 
        baseId: 15, 
        category: 'Spices & Masalas', 
        name: 'Cardamom Green', 
        img: 'https://placehold.co/100x100/008000/fff?text=CRD',
        variants: [
            { id: '15-50g', size: '50g', price: 250 },
            { id: '15-100g', size: '100g', price: 480 },
        ]
    },
];

const categoryColors = {
    'Spices & Masalas': 'bg-amber-100 text-amber-900',
};

const areas = ['Hoskote, Bengaluru Rural'];

const bannerImages = [
    { text: 'Farm Fresh Spices', color: 'bg-dsk-green/90', subtext: 'Pure & Authentic Masalas, delivered now.' },
    { text: 'Mega Masala Sale', color: 'bg-yellow-600/90', subtext: 'Up to 50% Off Select Powders! Limited Stock.' },
    { text: 'Aromas of India', color: 'bg-red-600/90', subtext: 'Discover Premium Quality Cardamom & Whole Spices.' }
];

let state = {
    cartItems: [],
    selectedArea: areas[0], 
    searchTerm: '',
    selectedCategory: 'All',
    isCartDrawerOpen: false,
    isCheckoutOpen: false,
    checkoutStage: 'address',
    checkoutData: {
        name: '',
        phone: '',
        email: '',
        deliveryAddress: '',
        paymentMethod: '',
    },
    isMenuOpen: false,
    currentBannerIndex: 0,
    currentPage: 'home'
};

// --- PRODUCT UTILITY FUNCTIONS ---

function getProductVariantById(id) {
    for (const product of baseProducts) {
        const variant = product.variants.find(v => v.id === id);
        if (variant) {
            return {
                id: variant.id,
                baseId: product.baseId,
                name: product.name,
                category: product.category,
                img: product.img,
                size: variant.size,
                price: variant.price
            };
        }
    }
    return null;
}

// --- DOM REFERENCES ---
const elements = {
    appHeader: document.getElementById('app-header'),
    dynamicPageContent: document.getElementById('dynamic-page-content'),
    productGrid: document.getElementById('product-grid-container'),
    categoryTabs: document.getElementById('category-tabs'),
    locationOptions: document.getElementById('location-options'),
    locationModalOverlay: document.getElementById('location-modal-overlay'),
    cartSidebarDesktop: document.getElementById('cart-sidebar-desktop'),
    cartDrawerMobile: document.getElementById('cart-drawer-mobile'),
    cartDrawerMobileOverlay: document.getElementById('cart-drawer-mobile-overlay'),
    mobileCartButton: document.getElementById('mobile-cart-button'),
    mobileCartCount: document.getElementById('mobile-cart-count'),
    messageBox: document.getElementById('message-box'),
    checkoutModalOverlay: document.getElementById('checkout-modal-overlay'),
    mobileMenuDrawer: document.getElementById('mobile-menu-drawer'),
    mobileMenuDrawerOverlay: document.getElementById('mobile-menu-drawer-overlay'),
    heroCarousel: null,
    carouselTrack: null,
    carouselDots: null,
};

let autoSlideInterval;

// --- UTILITY FUNCTIONS ---

function showMessage(text) {
    elements.messageBox.innerText = text;
    elements.messageBox.classList.remove('opacity-0', 'scale-95');
    elements.messageBox.classList.add('opacity-100', 'scale-100');
    setTimeout(() => {
        elements.messageBox.classList.remove('opacity-100', 'scale-100');
        elements.messageBox.classList.add('opacity-0', 'scale-95');
    }, 3000);
}

function toggleLocationModal(open) {
    if (open) {
        elements.locationModalOverlay.classList.remove('hidden');
        elements.locationModalOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
    } else {
        elements.locationModalOverlay.classList.add('hidden');
        elements.locationModalOverlay.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

function toggleCartDrawer(open) {
    state.isCartDrawerOpen = open;
    if (open) {
        elements.cartDrawerMobile.classList.remove('translate-x-full');
        elements.cartDrawerMobile.classList.add('translate-x-0');
        elements.cartDrawerMobileOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        elements.cartDrawerMobile.classList.remove('translate-x-0');
        elements.cartDrawerMobile.classList.add('translate-x-full');
        elements.cartDrawerMobileOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function toggleMenu(open) {
    state.isMenuOpen = open;
    if (open) {
        elements.mobileMenuDrawer.classList.remove('-translate-x-full');
        elements.mobileMenuDrawer.classList.add('translate-x-0');
        elements.mobileMenuDrawerOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        elements.mobileMenuDrawer.classList.remove('translate-x-0');
        elements.mobileMenuDrawer.classList.add('-translate-x-full');
        elements.mobileMenuDrawerOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Function to change the main content view
window.navigateTo = function(page) {
    if (state.isMenuOpen) toggleMenu(false); 
    document.getElementById('main-content-wrapper').scrollTo(0, 0); 

    if (page !== 'home' && page !== 'products') {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    updateStateAndRender({ currentPage: page });

    if ((page === 'home' || page === 'products') && !autoSlideInterval) {
        startAutoSlide();
    }
}


// --- CAROUSEL FUNCTIONS ---

window.setBanner = function(index) {
    if (index >= 0 && index < bannerImages.length) {
        updateStateAndRender({ currentBannerIndex: index });
    }
}

function nextBanner() {
    let nextIndex = state.currentBannerIndex + 1;
    if (nextIndex >= bannerImages.length) {
        nextIndex = 0; // Loop back
    }
    updateStateAndRender({ currentBannerIndex: nextIndex });
}

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextBanner, 5000); // Auto-slide every 5 seconds
}

function renderBanners() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !dotsContainer) return;

    track.innerHTML = bannerImages.map((banner, index) => `
        <div class="flex-shrink-0 w-full h-40 sm:h-52 md:h-64 flex items-center justify-center p-6 text-white ${banner.color} transition duration-300">
            <div class="text-center">
                <p class="text-xl sm:text-3xl md:text-4xl font-extrabold mb-1">${banner.text}</p>
                <p class="text-sm sm:text-lg">${banner.subtext}</p>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = bannerImages.map((_, index) => `
        <button 
            onclick="setBanner(${index})"
            class="w-3 h-3 rounded-full transition-colors duration-300 ${index === state.currentBannerIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}"
            aria-label="Go to banner ${index + 1}"
        ></button>
    `).join('');

    track.style.transform = `translateX(-${state.currentBannerIndex * 100}%)`;
}

// --- STATE UPDATE AND RENDERING ---

function updateStateAndRender(newState) {
    state = { ...state, ...newState };
    renderAll();
}

function addToCart(variantId, change) {
    const productVariant = getProductVariantById(variantId);
    if (!productVariant) return;

    let newCartItems = [...state.cartItems];
    const existingItemIndex = newCartItems.findIndex(item => item.id === variantId);

    if (existingItemIndex > -1) {
        const newQuantity = newCartItems[existingItemIndex].quantity + change;
        if (newQuantity <= 0) {
            newCartItems = newCartItems.filter(item => item.id !== variantId);
        } else {
            newCartItems[existingItemIndex].quantity = newQuantity;
        }
    } else if (change > 0) {
        newCartItems.push({ 
            ...productVariant, 
            quantity: 1,
            displayName: `${productVariant.name} (${productVariant.size})`
        });
        showMessage(`${productVariant.displayName} added to cart!`);
    }

    updateStateAndRender({ cartItems: newCartItems });
}

function startCheckout() {
    if (state.cartItems.length === 0) {
        showMessage("Your cart is empty. Please add items before checking out.");
        return;
    }
    updateStateAndRender({ isCheckoutOpen: true, checkoutStage: 'address' });
    if (state.isCartDrawerOpen) toggleCartDrawer(false);
}

function closeCheckout() {
    updateStateAndRender({ 
        isCheckoutOpen: false, 
        checkoutStage: 'address',
    });
}

function completeOrder() {
    const subtotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 && subtotal < 500 ? 30 : 0;
    const grandTotal = subtotal + deliveryFee;

    const orderSummary = `
        ===========================================
        DSK Naturals Order Confirmation
        Date: ${new Date().toLocaleString()}
        Area: ${state.selectedArea}
        -------------------------------------------
        Customer: ${state.checkoutData.name}
        Email: ${state.checkoutData.email}
        Address: ${state.checkoutData.deliveryAddress}
        Payment: ${state.checkoutData.paymentMethod}
        -------------------------------------------
        Items:
        ${state.cartItems.map(item => `- ${item.displayName} x ${item.quantity} (₹${(item.price * item.quantity).toFixed(2)})`).join('\n')}
        -------------------------------------------
        Subtotal: ₹${subtotal.toFixed(2)}
        Delivery: ₹${deliveryFee.toFixed(2)}
        Grand Total: ₹${grandTotal.toFixed(2)}
        ===========================================
    `.trim();
    
    console.log(orderSummary);

    showMessage(`Order placed! Bill sent to ${state.checkoutData.email}.`);

    updateStateAndRender({ 
        cartItems: [], 
        isCheckoutOpen: false,
        checkoutStage: 'address',
        checkoutData: { name: '', phone: '', email: '', deliveryAddress: '', paymentMethod: '' }
    });
}


function renderHeader() {
    const logoImgUrl = 'https://res.cloudinary.com/drmgywvk0/image/upload/v1762253211/logodsk_sxqwud.png';

    const headerHTML = `
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            
            <div class="flex items-center space-x-3">
                <button onclick="toggleMenu(true)" class="p-2 rounded-lg hover:bg-gray-100 text-dsk-green md:hidden">
                       <i data-lucide="menu" class="h-6 w-6"></i>
                </button>
                <div class="flex items-center w-full md:w-auto cursor-pointer" onclick="navigateTo('home')">
                    <img src="${logoImgUrl}" alt="DSK Naturals Logo" class="h-10 w-10 object-contain">
                    </div>
            </div>

            <nav class="hidden md:flex space-x-6 text-gray-700 font-medium">
                <a href="#" onclick="navigateTo('home')" class="hover:text-dsk-green transition ${state.currentPage === 'home' ? 'text-dsk-green font-bold' : ''}">Home</a>
                <a href="#" onclick="navigateTo('products')" class="hover:text-dsk-green transition ${state.currentPage === 'products' ? 'text-dsk-green font-bold' : ''}">Products</a>
                <a href="#" onclick="navigateTo('about')" class="hover:text-dsk-green transition ${state.currentPage === 'about' ? 'text-dsk-green font-bold' : ''}">About</a>
                <a href="#" onclick="navigateTo('contact')" class="hover:text-dsk-green transition ${state.currentPage === 'contact' ? 'text-dsk-green font-bold' : ''}">Contact</a>
            </nav>


            <div class="flex items-center space-x-4">
                <div class="flex items-center text-sm font-medium text-gray-700 p-2 rounded-lg bg-gray-50">
                    <a href="https://www.google.com/maps?q=13.099585,77.7777477" target="_blank" 
                        class="p-1 rounded-full hover:bg-gray-200 transition duration-150"
                        aria-label="View DSK Naturals on Map">
                        <i data-lucide="map-pin" class="h-5 w-5 text-red-500"></i>
                    </a>
                    <button
                        onclick="toggleLocationModal(true)"
                        class="flex items-center text-sm font-medium text-gray-700 hover:text-dsk-accent-green transition duration-150 p-1 rounded-lg"
                    >
                        <span class="font-bold ml-1 text-dsk-green truncate hidden sm:inline">${state.selectedArea}</span>
                        <span class="ml-1 text-xs text-gray-500">▼</span>
                    </button>
                </div>

                <div class="w-64 relative hidden lg:block">
                    <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Search..."
                        value="${state.searchTerm}"
                        oninput="updateStateAndRender({ searchTerm: this.value })"
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-dsk-accent-green focus:border-dsk-accent-green transition duration-150"
                    />
                </div>
            </div>
        </div>
        <div class="md:hidden px-4 pb-3">
            <div class="relative">
                <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"></i>
                <input
                    type="text"
                    placeholder="Search for 10-min groceries..."
                    value="${state.searchTerm}"
                    oninput="updateStateAndRender({ searchTerm: this.value })"
                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-dsk-accent-green focus:border-dsk-accent-green transition duration-150"
                />
            </div>
        </div>
    `;
    elements.appHeader.innerHTML = headerHTML;
    lucide.createIcons();
}

function renderMenu() {
    const logoImgUrl = 'https://res.cloudinary.com/drmgywvk0/image/upload/w_200,c_fit,f_auto,q_auto/v1762253211/logodsk_sxqwud.png';
    
    const linkClass = (page) => `flex items-center space-x-3 p-3 rounded-xl transition ${state.currentPage === page ? 'bg-dsk-green/20 text-dsk-green font-bold' : 'hover:bg-dsk-green/10 text-gray-800 hover:text-dsk-green'}`;
    
    const menuHTML = `
        <div class="p-6 h-full flex flex-col">
            <div class="flex justify-between items-center pb-5 border-b mb-6">
                <div class="flex items-center space-x-2">
                    <img src="${logoImgUrl}" alt="DSK Naturals Logo" class="h-9 w-9 object-contain">
                    </div>
                <button onclick="toggleMenu(false)" class="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100">
                    <i data-lucide="x" class="h-6 w-6"></i>
                </button>
            </div>
            <nav class="flex flex-col space-y-4 text-lg font-medium">
                <a href="#" onclick="navigateTo('home')" class="${linkClass('home')}">
                    <i data-lucide="home" class="h-5 w-5"></i>
                    <span>Home</span>
                </a>
                <a href="#" onclick="navigateTo('products')" class="${linkClass('products')}">
                    <i data-lucide="shopping-basket" class="h-5 w-5"></i>
                    <span>Products (Masalas)</span>
                </a>
                <a href="#" onclick="navigateTo('about')" class="${linkClass('about')}">
                    <i data-lucide="info" class="h-5 w-5"></i>
                    <span>About Us</span>
                </a>
                <a href="#" onclick="navigateTo('contact')" class="${linkClass('contact')}">
                    <i data-lucide="phone" class="h-5 w-5"></i>
                    <span>Contact</span>
                </a>
            </nav>
            <div class="mt-auto pt-6 border-t">
                <p class="text-xs text-gray-500">© 2025 DSK Naturals Quick Commerce.</p>
            </div>
        </div>
    `;
    elements.mobileMenuDrawer.innerHTML = menuHTML;
    lucide.createIcons();
}

// --- NEW PAGE RENDERING FUNCTIONS ---

function renderAboutPage() {
    elements.dynamicPageContent.innerHTML = `
        <div class="p-4 md:p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">About DSK Naturals</h2>
            
            <div class="bg-white p-6 md:p-10 rounded-xl shadow-xl space-y-8">
                
                <div class="text-center border-b pb-6">
                    <i data-lucide="leaf" class="h-10 w-10 text-dsk-green mx-auto mb-3"></i>
                    <p class="text-xl font-semibold text-gray-700">
                        Our commitment is to bring you the purest, most authentic spices, sourced directly from the farm to your kitchen with speed and care.
                    </p>
                </div>

                <div class="flex items-start space-x-6 p-4 bg-dsk-green/5 rounded-lg border border-dsk-green/20">
                    <i data-lucide="calendar-check" class="h-8 w-8 text-dsk-dark-green flex-shrink-0 mt-1"></i>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Established</p>
                        <p class="text-xl font-bold text-dsk-green">2021</p>
                    </div>
                </div>

                <div class="flex items-start space-x-6 p-4 bg-dsk-green/5 rounded-lg border border-dsk-green/20">
                    <i data-lucide="map-pin" class="h-8 w-8 text-dsk-dark-green flex-shrink-0 mt-1"></i>
                    <div>
                        <p class="text-sm font-medium text-gray-500">Corporate Address</p>
                        <p class="text-lg font-semibold text-gray-800 leading-relaxed">
                            Aalapanahalli main road, Hosakote taluk, Hosakote, 
                            <br>Bengaluru rural district, Karnataka - 562114
                        </p>
                    </div>
                </div>

            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderContactPage() {
    elements.dynamicPageContent.innerHTML = `
        <div class="p-4 md:p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Get in Touch</h2>
            
            <div class="grid md:grid-cols-2 gap-6">

                <div class="bg-white p-8 rounded-xl shadow-xl text-center transition hover:shadow-2xl hover:border-dsk-green border border-white">
                    <i data-lucide="phone-call" class="h-10 w-10 text-dsk-green mx-auto mb-4"></i>
                    <p class="text-sm font-medium text-gray-500 mb-1">Call Us Directly</p>
                    <a href="tel:9886176276" class="text-2xl font-extrabold text-gray-900 hover:text-dsk-accent-green transition">
                        9886176276
                    </a>
                </div>

                <div class="bg-white p-8 rounded-xl shadow-xl text-center transition hover:shadow-2xl hover:border-dsk-green border border-white">
                    <i data-lucide="mail" class="h-10 w-10 text-dsk-green mx-auto mb-4"></i>
                    <p class="text-sm font-medium text-gray-500 mb-1">Send us an Email</p>
                    <a href="mailto:dsknaturals0987@gmail.com" class="text-lg font-extrabold text-gray-900 hover:text-dsk-accent-green transition break-words">
                        dsknaturals0987@gmail.com
                    </a>
                </div>

                <div class="md:col-span-2 bg-white p-8 rounded-xl shadow-xl text-center transition hover:shadow-2xl hover:border-dsk-green border border-white">
                    <i data-lucide="globe" class="h-10 w-10 text-dsk-green mx-auto mb-4"></i>
                    <p class="text-sm font-medium text-gray-500 mb-1">Official Website</p>
                    <a href="http://dsknaturals.com" target="_blank" class="text-2xl font-extrabold text-gray-900 hover:text-dsk-accent-green transition flex items-center justify-center">
                        dsknaturals.com
                        <i data-lucide="external-link" class="h-5 w-5 ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderProductsPage() {
    elements.dynamicPageContent.innerHTML = `
        <div id="hero-carousel" class="relative overflow-hidden rounded-xl m-4 shadow-xl">
            <div id="carousel-track" class="flex transition-transform duration-500 ease-in-out">
                </div>
            <div id="carousel-dots" class="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                </div>
        </div>
        
        <div id="category-tabs" class="flex flex-wrap gap-2 mb-6 sticky top-[100px] md:top-[80px] z-10 bg-white pt-2 pb-3 shadow-sm rounded-lg mx-4 md:mx-8">
                </div>

        <div id="product-grid-container" class="p-4 md:p-8 pt-0">
                </div>
    `;
    // Re-assign dynamic elements after injection
    elements.heroCarousel = document.getElementById('hero-carousel');
    elements.carouselTrack = document.getElementById('carousel-track');
    elements.carouselDots = document.getElementById('carousel-dots');
    elements.productGrid = document.getElementById('product-grid-container');
    elements.categoryTabs = document.getElementById('category-tabs');

    renderBanners();
    renderCategoryTabs();
    renderProductGrid();
}

function renderLocationModal() {
    elements.locationOptions.innerHTML = areas.map(area => `
        <button
            onclick="updateStateAndRender({ selectedArea: '${area}' }); toggleLocationModal(false); showMessage('Delivery area set to ${area}');"
            class="w-full text-left p-3 rounded-xl border transition duration-150 ${
                state.selectedArea === area
                ? 'bg-dsk-green text-white border-dsk-dark-green shadow-md'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
            }"
        >
            <i data-lucide="map-pin" class="inline h-4 w-4 mr-2"></i>
            ${area}
        </button>
    `).join('');
    lucide.createIcons();
}

function renderCategoryTabs() {
    // Only render tabs if the product list is active
    if (state.currentPage !== 'home' && state.currentPage !== 'products') return;

    const categories = ['All', ...new Set(baseProducts.map(p => p.category))];
    elements.categoryTabs.innerHTML = categories.map(category => {
        if (categories.length === 2 && category !== 'All') return ''; 

        return `
            <button
                onclick="updateStateAndRender({ selectedCategory: '${category}' })"
                class="px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm
                ${state.selectedCategory === category
                    ? 'bg-dsk-green text-white ring-2 ring-dsk-accent-green'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }"
            >
                ${category}
            </button>
        `;
    }).join('');
}

window.updatePriceDisplay = function(selectElement, baseId) {
    const selectedId = selectElement.value;
    const variant = getProductVariantById(selectedId);
    
    const priceElement = document.getElementById(`price-${baseId}`);
    const addButton = document.getElementById(`add-btn-${baseId}`);

    if (variant && priceElement && addButton) {
        priceElement.innerText = `₹${variant.price}`;
        addButton.setAttribute('onclick', `handleAddToCartClick('${selectedId}')`);
    }
}

window.handleAddToCartClick = function(variantId) {
    // Find the base ID from the variant ID
    const parts = variantId.split('-');
    const baseId = parts[0]; 

    // If the function was called directly from the product card (using baseId for lookup)
    if (variantId.length < 5) { 
          const selectElement = document.getElementById(`variant-select-${variantId}`);
          if (selectElement) {
              variantId = selectElement.value;
          } else {
              const product = baseProducts.find(p => p.baseId == variantId);
              variantId = product ? product.variants[0].id : null;
          }
    }
    
    if (variantId) {
          addToCart(variantId, 1);
    }
}

function renderProductGrid() {
    // Only render grid if the product list is active
    if (state.currentPage !== 'home' && state.currentPage !== 'products') return;

    const lowerCaseSearchTerm = state.searchTerm.toLowerCase();
    let filteredProducts = baseProducts;
    
    if (state.selectedCategory !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === state.selectedCategory);
    }

    if (lowerCaseSearchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            p.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    if (filteredProducts.length === 0) {
        elements.productGrid.innerHTML = `
            <div class="text-center p-12 bg-white rounded-xl shadow-lg">
                <i data-lucide="search" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                <p class="text-xl font-semibold text-gray-700">No products found.</p>
                <p class="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
        `;
    } else {
        elements.productGrid.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                ${filteredProducts.map(product => {
                    const defaultVariant = product.variants[0];
                    const categoryClass = categoryColors[product.category] || 'bg-gray-100 text-gray-800';

                    const variantOptions = product.variants.map(v => `
                        <option value="${v.id}" data-price="${v.price}">
                            ${v.size} (₹${v.price})
                        </option>
                    `).join('');

                    return `
                        <div class="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between h-full">
                            <div class="flex flex-col items-center">
                                <img src="${product.img}" alt="${product.name}" class="w-24 h-24 object-contain mb-3 rounded-lg" onerror="this.onerror=null; this.src='https://placehold.co/100x100/CCCCCC/000?text=Item';" />
                                <span class="text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${categoryClass}">
                                    ${product.category}
                                </span>
                                <h3 class="text-base font-semibold text-gray-900 text-center mb-1 line-clamp-2">${product.name}</h3>
                            </div>
                            
                            <div class="w-full relative mb-3">
                                <select 
                                    id="variant-select-${product.baseId}"
                                    onchange="updatePriceDisplay(this, ${product.baseId})"
                                    class="variant-select w-full p-2 border border-gray-300 rounded-lg text-sm text-dsk-green font-medium focus:border-dsk-accent-green focus:ring-1 focus:ring-dsk-accent-green"
                                >
                                    ${variantOptions}
                                </select>
                            </div>

                            <div class="mt-3 flex items-center justify-between">
                                <span id="price-${product.baseId}" class="text-lg font-bold text-dsk-green">₹${defaultVariant.price}</span>
                                
                                <button
                                    id="add-btn-${product.baseId}"
                                    onclick="handleAddToCartClick('${defaultVariant.id}')"
                                    class="bg-dsk-green hover:bg-dsk-dark-green text-white p-2 rounded-full shadow-md transition duration-150 flex items-center text-sm font-medium"
                                >
                                    <i data-lucide="plus" class="h-4 w-4"></i>
                                    <span class="ml-1 hidden sm:inline">Add</span>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    lucide.createIcons();
}

function renderCartContent(containerElement) {
    const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 && subtotal < 500 ? 30 : 0;
    const grandTotal = subtotal + deliveryFee;

    let itemsHTML = '';
    if (state.cartItems.length === 0) {
        itemsHTML = `
            <div class="text-center py-12 text-gray-500">
                <i data-lucide="shopping-cart" class="h-12 w-12 mx-auto mb-3"></i>
                <p class="font-semibold">Your cart is empty.</p>
                <p class="text-sm">Start adding some essentials!</p>
            </div>
        `;
    } else {
        itemsHTML = state.cartItems.map(item => `
            <div key="${item.id}" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                <div class="flex items-center space-x-3">
                    <img src="${item.img}" alt="${item.name}" class="w-10 h-10 rounded-full object-cover" onerror="this.onerror=null; this.src='https://placehold.co/40x40/CCCCCC/000?text=I';" />
                    <div>
                        <p class="text-sm font-medium text-gray-900 line-clamp-1">${item.displayName}</p>
                        <p class="text-xs text-gray-500">₹${item.price} x ${item.quantity}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="addToCart('${item.id}', -1)" class="text-dsk-green hover:text-dsk-dark-green">
                        <i data-lucide="minus" class="h-4 w-4"></i>
                    </button>
                    <span class="text-sm font-semibold w-4 text-center">${item.quantity}</span>
                    <button onclick="addToCart('${item.id}', 1)" class="text-dsk-green hover:text-dsk-dark-green">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    const cartFooterHTML = state.cartItems.length > 0 ? `
        <div class="p-5 border-t bg-gray-50">
            <div class="space-y-2 mb-4 text-sm text-gray-700">
                <div class="flex justify-between">
                    <span>Subtotal:</span>
                    <span class="font-medium">₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span class="${deliveryFee > 0 ? 'text-red-500' : 'text-dsk-green font-medium'}">
                        ${deliveryFee > 0 ? `+ ₹${deliveryFee.toFixed(2)}` : 'FREE'}
                    </span>
                </div>
                ${deliveryFee > 0 ? `<p class='text-xs text-red-500 text-right'>*Free delivery over ₹500</p>` : ''}
            </div>
            <div class="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-3">
                <span>Grand Total:</span>
                <span>₹${grandTotal.toFixed(2)}</span>
            </div>
            <button
                onclick="startCheckout()"
                class="mt-4 w-full bg-dsk-green hover:bg-dsk-dark-green text-white font-bold py-3 rounded-xl shadow-lg transition duration-150 transform hover:scale-[1.01]"
            >
                Proceed to Checkout
            </button>
            <button
                onclick="updateStateAndRender({cartItems: []})"
                class="mt-2 w-full text-sm text-red-500 hover:text-red-700"
            >
                Clear Cart
            </button>
        </div>
    ` : `<div class="p-5 border-t bg-gray-50 h-20"></div>`; 

    const cartHeaderHTML = `
        <div class="p-5 border-b flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <i data-lucide="shopping-cart" class="h-6 w-6 mr-2 text-dsk-green"></i>
                My Cart (${totalItems})
            </h2>
            ${containerElement === elements.cartDrawerMobile ? `
                <button onclick="toggleCartDrawer(false)" class="lg:hidden text-gray-500 hover:text-dsk-dark-green p-2 rounded-full hover:bg-gray-100 transition">
                    <i data-lucide="x" class="h-6 w-6"></i>
                </button>
            ` : ''}
        </div>
    `;

    const cartBodyHTML = `
        <div id="cart-items-list" class="flex-grow p-4 overflow-y-auto space-y-4">
            ${itemsHTML}
        </div>
    `;
    
    containerElement.innerHTML = `
        <div class="flex flex-col h-full">
            ${cartHeaderHTML}
            ${cartBodyHTML}
            ${cartFooterHTML}
        </div>
    `;

    lucide.createIcons();
}

function renderCheckoutModal() {
    if (!state.isCheckoutOpen) {
        elements.checkoutModalOverlay.classList.remove('flex');
        elements.checkoutModalOverlay.classList.add('hidden');
        return;
    }

    elements.checkoutModalOverlay.classList.remove('hidden');
    elements.checkoutModalOverlay.classList.add('flex');
    
    const modalContainer = elements.checkoutModalOverlay.querySelector('.max-w-lg');
    let contentHTML = '';

    const grandTotal = (state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + (state.cartItems.length > 0 && state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) < 500 ? 30 : 0)).toFixed(2);
    
    const formInput = (id, label, type = 'text', value = '', required = true, placeholder = '') => `
        <div class="mb-4">
            <label for="${id}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
            <input
                type="${type}"
                id="${id}"
                name="${id}"
                value="${value}"
                oninput="state.checkoutData.${id} = this.value"
                placeholder="${placeholder}"
                ${required ? 'required' : ''}
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-dsk-green focus:border-dsk-green transition duration-150"
            />
        </div>
    `;

    if (state.checkoutStage === 'address') {
        contentHTML = `
            <h2 class="text-2xl font-bold text-dsk-green mb-4 border-b pb-3 flex justify-between items-center">
                Delivery Details (1/2)
                <button onclick="closeCheckout()" class="text-gray-500 hover:text-red-600">
                    <i data-lucide="x" class="h-6 w-6"></i>
                </button>
            </h2>
            <form id="address-form" onsubmit="event.preventDefault(); handleCheckoutSubmit('address');">
                ${formInput('name', 'Full Name', 'text', state.checkoutData.name)}
                ${formInput('phone', 'Phone Number', 'tel', state.checkoutData.phone, true, 'e.g., +91 9876543210')}
                ${formInput('email', 'Email Address (for Bill)', 'email', state.checkoutData.email, true, 'your.email@example.com')}
                <div class="mb-4">
                    <label for="deliveryAddress" class="block text-sm font-medium text-gray-700 mb-1">Delivery Address (Current Area: ${state.selectedArea})</label>
                    <textarea
                        id="deliveryAddress"
                        name="deliveryAddress"
                        rows="3"
                        oninput="state.checkoutData.deliveryAddress = this.value"
                        placeholder="House No, Street, Landmark"
                        required
                        class="w-full p-3 border border-gray-300 rounded-xl focus:ring-dsk-green focus:border-dsk-green transition duration-150"
                    >${state.checkoutData.deliveryAddress}</textarea>
                </div>

                <div class="pt-4 border-t mt-4 flex justify-between items-center">
                        <p class="text-lg font-bold text-gray-900">Total: ₹${grandTotal}</p>
                    <button type="submit" class="bg-dsk-green hover:bg-dsk-dark-green text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-150">
                        Proceed to Payment
                        <i data-lucide="arrow-right" class="h-5 w-5 ml-2 inline"></i>
                    </button>
                </div>
            </form>
        `;
    } else if (state.checkoutStage === 'payment') {
        contentHTML = `
            <h2 class="text-2xl font-bold text-dsk-green mb-4 border-b pb-3 flex justify-between items-center">
                Select Payment (2/2)
                <button onclick="closeCheckout()" class="text-gray-500 hover:text-red-600">
                    <i data-lucide="x" class="h-6 w-6"></i>
                </button>
            </h2>
            <div class="mb-4">
                <p class="text-md text-gray-700 font-semibold mb-2">Order Total: <span class="text-dsk-green">₹${grandTotal}</span></p>
                <p class="text-sm text-gray-500 mb-4">Please select your preferred payment method.</p>
            </div>

            <div class="space-y-4">
                ${renderPaymentOption('UPI / Google Pay / PhonePe', 'UPI', 'qr-code')}
                ${renderPaymentOption('Credit / Debit Card', 'Card', 'credit-card')}
                ${renderPaymentOption('Cash on Delivery (COD)', 'COD', 'wallet')}
            </div>
            
            <div class="pt-4 border-t mt-6 flex justify-between items-center">
                <button onclick="updateStateAndRender({checkoutStage: 'address'})" class="text-sm text-gray-600 hover:text-dsk-dark-green flex items-center">
                    <i data-lucide="arrow-left" class="h-4 w-4 mr-1"></i>
                    Back to Address
                </button>
                <button 
                    id="final-pay-button"
                    onclick="handleCheckoutSubmit('payment')" 
                    class="bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-xl shadow-lg transition duration-150"
                    disabled
                >
                    Place Order (₹${grandTotal})
                </button>
            </div>
        `;
    }

    modalContainer.innerHTML = contentHTML;
    lucide.createIcons();
    
    if (state.checkoutStage === 'payment') {
        const finalPayButton = document.getElementById('final-pay-button');
        if (finalPayButton) {
            finalPayButton.disabled = state.checkoutData.paymentMethod === '';
            if (!finalPayButton.disabled) {
                finalPayButton.classList.replace('bg-gray-300', 'bg-dsk-green');
                finalPayButton.classList.replace('text-gray-500', 'text-white');
                finalPayButton.classList.add('hover:bg-dsk-dark-green');
            }
        }
    }
}

function renderPaymentOption(label, method, icon) {
    const isSelected = state.checkoutData.paymentMethod === method;
    return `
        <div 
            onclick="handlePaymentSelection('${method}')" 
            class="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition duration-200 
            ${isSelected 
                ? 'border-dsk-green ring-2 ring-dsk-accent-green bg-dsk-green/10 shadow-md' 
                : 'border-gray-300 hover:border-dsk-accent-green hover:bg-gray-50'
            }"
        >
            <div class="flex items-center space-x-3">
                <i data-lucide="${icon}" class="h-6 w-6 ${isSelected ? 'text-dsk-green' : 'text-gray-500'}"></i>
                <span class="font-medium ${isSelected ? 'text-dsk-green' : 'text-gray-800'}">${label}</span>
            </div>
            ${isSelected ? '<i data-lucide="check-circle" class="h-6 w-6 text-dsk-green"></i>' : ''}
        </div>
    `;
}

window.handlePaymentSelection = function(method) {
    updateStateAndRender({ 
        checkoutData: { ...state.checkoutData, paymentMethod: method }
    });
}

window.handleCheckoutSubmit = function(stage) {
    if (stage === 'address') {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('deliveryAddress').value.trim();

        if (!name || !phone || !email || !address) {
            showMessage('Please fill out all address details.');
            return;
        }

        updateStateAndRender({
            checkoutStage: 'payment',
            checkoutData: {
                ...state.checkoutData,
                name: name,
                phone: phone,
                email: email,
                deliveryAddress: address,
            }
        });

    } else if (stage === 'payment') {
        if (state.checkoutData.paymentMethod === '') {
            showMessage('Please select a payment method.');
            return;
        }
        completeOrder();
    }
}


function renderCart() {
    elements.cartSidebarDesktop.classList.add('sticky', 'top-[90px]', 'h-[calc(100vh-100px)]', 'border-l', 'border-gray-100', 'bg-white', 'shadow-xl');
    renderCartContent(elements.cartSidebarDesktop);

    renderCartContent(elements.cartDrawerMobile);
    
    const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        elements.mobileCartCount.innerText = totalItems;
        elements.mobileCartCount.classList.remove('hidden');
    } else {
        elements.mobileCartCount.classList.add('hidden');
    }
    elements.mobileCartButton.style.display = 'flex';
}


function renderAll() {
    renderHeader();
    renderMenu();

    // New logic to control the main content area based on currentPage state
    if (state.currentPage === 'about') {
        renderAboutPage();
    } else if (state.currentPage === 'contact') {
        renderContactPage();
    } else {
        // Default to product view for 'home' and 'products'
        renderProductsPage();
    }
    
    renderLocationModal();
    renderCart();
    renderCheckoutModal();
}


// --- INITIALIZATION ---
window.onload = function() {
    // Render initial content
    renderAll();
    startAutoSlide();

    // Get dynamic elements after initial product page render
    elements.heroCarousel = document.getElementById('hero-carousel');
    elements.carouselTrack = document.getElementById('carousel-track');
    elements.carouselDots = document.getElementById('carousel-dots');
    elements.productGrid = document.getElementById('product-grid-container');
    elements.categoryTabs = document.getElementById('category-tabs');


    // Fix for Lucide icons rendering after asynchronous updates
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector('[data-lucide]')) {
                        lucide.createIcons();
                    }
                });
            }
        });
    });
    
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
    observer.observe(elements.appHeader, { childList: true, subtree: true });
    observer.observe(elements.checkoutModalOverlay, { childList: true, subtree: true });
};

// Expose functions globally for HTML event handlers
window.toggleLocationModal = toggleLocationModal;
window.updateStateAndRender = updateStateAndRender;
window.addToCart = addToCart;
window.toggleCartDrawer = toggleCartDrawer;
window.toggleMenu = toggleMenu;
window.startCheckout = startCheckout;
window.closeCheckout = closeCheckout;
window.completeOrder = completeOrder;
window.getProductVariantById = getProductVariantById; 
window.setBanner = setBanner;