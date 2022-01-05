package com.bouziane_ilyas.store.web.rest;

import static com.bouziane_ilyas.store.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bouziane_ilyas.store.IntegrationTest;
import com.bouziane_ilyas.store.domain.Product;
import com.bouziane_ilyas.store.domain.enumeration.ProductSize;
import com.bouziane_ilyas.store.repository.ProductRepository;
import com.bouziane_ilyas.store.service.dto.ProductDTO;
import com.bouziane_ilyas.store.service.mapper.ProductMapper;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductResourceIT {

    private static final String DEFAULT_SKU = "AAAAAAAAAA";
    private static final String UPDATED_SKU = "BBBBBBBBBB";

    private static final String DEFAULT_UPC = "AAAAAAAAAA";
    private static final String UPDATED_UPC = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(0);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(1);

    private static final ProductSize DEFAULT_PRODUCT_SIZE = ProductSize.XS;
    private static final ProductSize UPDATED_PRODUCT_SIZE = ProductSize.S;

    private static final String DEFAULT_COLORS = "em";
    private static final String UPDATED_COLORS = "daeene,s,jkq,wbwlpd,tvsd";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_IMAGE_SHA_1 = "55b856b8b3070a065f78d062e1601d98c1fd1e7d";
    private static final String UPDATED_IMAGE_SHA_1 = "fb23b894f21320385cda7397cb098433656cb3ca";

    private static final String DEFAULT_IMAGE_CDN_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_CDN_URL = "BBBBBBBBBB";

    private static final String DEFAULT_THUMBNAIL_SHA_1 = "7346b567628feb846cfc72753fcab283b28ea0be";
    private static final String UPDATED_THUMBNAIL_SHA_1 = "5f244e48f3f5ad08963bc2d8239c8b41d275b467";

    private static final String DEFAULT_THUMBNAIL_CDN_URL = "AAAAAAAAAA";
    private static final String UPDATED_THUMBNAIL_CDN_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductMockMvc;

    private Product product;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Product createEntity(EntityManager em) {
        Product product = new Product()
            .sku(DEFAULT_SKU)
            .upc(DEFAULT_UPC)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .price(DEFAULT_PRICE)
            .productSize(DEFAULT_PRODUCT_SIZE)
            .colors(DEFAULT_COLORS)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .imageSha1(DEFAULT_IMAGE_SHA_1)
            .imageCdnUrl(DEFAULT_IMAGE_CDN_URL)
            .thumbnailSha1(DEFAULT_THUMBNAIL_SHA_1)
            .thumbnailCdnUrl(DEFAULT_THUMBNAIL_CDN_URL);
        return product;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Product createUpdatedEntity(EntityManager em) {
        Product product = new Product()
            .sku(UPDATED_SKU)
            .upc(UPDATED_UPC)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .productSize(UPDATED_PRODUCT_SIZE)
            .colors(UPDATED_COLORS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .imageSha1(UPDATED_IMAGE_SHA_1)
            .imageCdnUrl(UPDATED_IMAGE_CDN_URL)
            .thumbnailSha1(UPDATED_THUMBNAIL_SHA_1)
            .thumbnailCdnUrl(UPDATED_THUMBNAIL_CDN_URL);
        return product;
    }

    @BeforeEach
    public void initTest() {
        product = createEntity(em);
    }

    @Test
    @Transactional
    void createProduct() throws Exception {
        int databaseSizeBeforeCreate = productRepository.findAll().size();
        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);
        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isCreated());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeCreate + 1);
        Product testProduct = productList.get(productList.size() - 1);
        assertThat(testProduct.getSku()).isEqualTo(DEFAULT_SKU);
        assertThat(testProduct.getUpc()).isEqualTo(DEFAULT_UPC);
        assertThat(testProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProduct.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProduct.getPrice()).isEqualByComparingTo(DEFAULT_PRICE);
        assertThat(testProduct.getProductSize()).isEqualTo(DEFAULT_PRODUCT_SIZE);
        assertThat(testProduct.getColors()).isEqualTo(DEFAULT_COLORS);
        assertThat(testProduct.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testProduct.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testProduct.getImageSha1()).isEqualTo(DEFAULT_IMAGE_SHA_1);
        assertThat(testProduct.getImageCdnUrl()).isEqualTo(DEFAULT_IMAGE_CDN_URL);
        assertThat(testProduct.getThumbnailSha1()).isEqualTo(DEFAULT_THUMBNAIL_SHA_1);
        assertThat(testProduct.getThumbnailCdnUrl()).isEqualTo(DEFAULT_THUMBNAIL_CDN_URL);
    }

    @Test
    @Transactional
    void createProductWithExistingId() throws Exception {
        // Create the Product with an existing ID
        product.setId(1L);
        ProductDTO productDTO = productMapper.toDto(product);

        int databaseSizeBeforeCreate = productRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSkuIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setSku(null);

        // Create the Product, which fails.
        ProductDTO productDTO = productMapper.toDto(product);

        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUpcIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setUpc(null);

        // Create the Product, which fails.
        ProductDTO productDTO = productMapper.toDto(product);

        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setName(null);

        // Create the Product, which fails.
        ProductDTO productDTO = productMapper.toDto(product);

        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setPrice(null);

        // Create the Product, which fails.
        ProductDTO productDTO = productMapper.toDto(product);

        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkProductSizeIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setProductSize(null);

        // Create the Product, which fails.
        ProductDTO productDTO = productMapper.toDto(product);

        restProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProducts() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        // Get all the productList
        restProductMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(product.getId().intValue())))
            .andExpect(jsonPath("$.[*].sku").value(hasItem(DEFAULT_SKU)))
            .andExpect(jsonPath("$.[*].upc").value(hasItem(DEFAULT_UPC)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].productSize").value(hasItem(DEFAULT_PRODUCT_SIZE.toString())))
            .andExpect(jsonPath("$.[*].colors").value(hasItem(DEFAULT_COLORS)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].imageSha1").value(hasItem(DEFAULT_IMAGE_SHA_1)))
            .andExpect(jsonPath("$.[*].imageCdnUrl").value(hasItem(DEFAULT_IMAGE_CDN_URL)))
            .andExpect(jsonPath("$.[*].thumbnailSha1").value(hasItem(DEFAULT_THUMBNAIL_SHA_1)))
            .andExpect(jsonPath("$.[*].thumbnailCdnUrl").value(hasItem(DEFAULT_THUMBNAIL_CDN_URL)));
    }

    @Test
    @Transactional
    void getProduct() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        // Get the product
        restProductMockMvc
            .perform(get(ENTITY_API_URL_ID, product.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(product.getId().intValue()))
            .andExpect(jsonPath("$.sku").value(DEFAULT_SKU))
            .andExpect(jsonPath("$.upc").value(DEFAULT_UPC))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.productSize").value(DEFAULT_PRODUCT_SIZE.toString()))
            .andExpect(jsonPath("$.colors").value(DEFAULT_COLORS))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.imageSha1").value(DEFAULT_IMAGE_SHA_1))
            .andExpect(jsonPath("$.imageCdnUrl").value(DEFAULT_IMAGE_CDN_URL))
            .andExpect(jsonPath("$.thumbnailSha1").value(DEFAULT_THUMBNAIL_SHA_1))
            .andExpect(jsonPath("$.thumbnailCdnUrl").value(DEFAULT_THUMBNAIL_CDN_URL));
    }

    @Test
    @Transactional
    void getNonExistingProduct() throws Exception {
        // Get the product
        restProductMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProduct() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        int databaseSizeBeforeUpdate = productRepository.findAll().size();

        // Update the product
        Product updatedProduct = productRepository.findById(product.getId()).get();
        // Disconnect from session so that the updates on updatedProduct are not directly saved in db
        em.detach(updatedProduct);
        updatedProduct
            .sku(UPDATED_SKU)
            .upc(UPDATED_UPC)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .productSize(UPDATED_PRODUCT_SIZE)
            .colors(UPDATED_COLORS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .imageSha1(UPDATED_IMAGE_SHA_1)
            .imageCdnUrl(UPDATED_IMAGE_CDN_URL)
            .thumbnailSha1(UPDATED_THUMBNAIL_SHA_1)
            .thumbnailCdnUrl(UPDATED_THUMBNAIL_CDN_URL);
        ProductDTO productDTO = productMapper.toDto(updatedProduct);

        restProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productDTO))
            )
            .andExpect(status().isOk());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
        Product testProduct = productList.get(productList.size() - 1);
        assertThat(testProduct.getSku()).isEqualTo(UPDATED_SKU);
        assertThat(testProduct.getUpc()).isEqualTo(UPDATED_UPC);
        assertThat(testProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProduct.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProduct.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testProduct.getProductSize()).isEqualTo(UPDATED_PRODUCT_SIZE);
        assertThat(testProduct.getColors()).isEqualTo(UPDATED_COLORS);
        assertThat(testProduct.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testProduct.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testProduct.getImageSha1()).isEqualTo(UPDATED_IMAGE_SHA_1);
        assertThat(testProduct.getImageCdnUrl()).isEqualTo(UPDATED_IMAGE_CDN_URL);
        assertThat(testProduct.getThumbnailSha1()).isEqualTo(UPDATED_THUMBNAIL_SHA_1);
        assertThat(testProduct.getThumbnailCdnUrl()).isEqualTo(UPDATED_THUMBNAIL_CDN_URL);
    }

    @Test
    @Transactional
    void putNonExistingProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();
        product.setId(count.incrementAndGet());

        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();
        product.setId(count.incrementAndGet());

        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();
        product.setId(count.incrementAndGet());

        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductWithPatch() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        int databaseSizeBeforeUpdate = productRepository.findAll().size();

        // Update the product using partial update
        Product partialUpdatedProduct = new Product();
        partialUpdatedProduct.setId(product.getId());

        partialUpdatedProduct
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .productSize(UPDATED_PRODUCT_SIZE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .imageSha1(UPDATED_IMAGE_SHA_1)
            .imageCdnUrl(UPDATED_IMAGE_CDN_URL);

        restProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduct))
            )
            .andExpect(status().isOk());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
        Product testProduct = productList.get(productList.size() - 1);
        assertThat(testProduct.getSku()).isEqualTo(DEFAULT_SKU);
        assertThat(testProduct.getUpc()).isEqualTo(DEFAULT_UPC);
        assertThat(testProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProduct.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProduct.getPrice()).isEqualByComparingTo(UPDATED_PRICE);
        assertThat(testProduct.getProductSize()).isEqualTo(UPDATED_PRODUCT_SIZE);
        assertThat(testProduct.getColors()).isEqualTo(DEFAULT_COLORS);
        assertThat(testProduct.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testProduct.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testProduct.getImageSha1()).isEqualTo(UPDATED_IMAGE_SHA_1);
        assertThat(testProduct.getImageCdnUrl()).isEqualTo(UPDATED_IMAGE_CDN_URL);
        assertThat(testProduct.getThumbnailSha1()).isEqualTo(DEFAULT_THUMBNAIL_SHA_1);
        assertThat(testProduct.getThumbnailCdnUrl()).isEqualTo(DEFAULT_THUMBNAIL_CDN_URL);
    }

    @Test
    @Transactional
    void fullUpdateProductWithPatch() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        int databaseSizeBeforeUpdate = productRepository.findAll().size();

        // Update the product using partial update
        Product partialUpdatedProduct = new Product();
        partialUpdatedProduct.setId(product.getId());

        partialUpdatedProduct
            .sku(UPDATED_SKU)
            .upc(UPDATED_UPC)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .productSize(UPDATED_PRODUCT_SIZE)
            .colors(UPDATED_COLORS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .imageSha1(UPDATED_IMAGE_SHA_1)
            .imageCdnUrl(UPDATED_IMAGE_CDN_URL)
            .thumbnailSha1(UPDATED_THUMBNAIL_SHA_1)
            .thumbnailCdnUrl(UPDATED_THUMBNAIL_CDN_URL);

        restProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduct))
            )
            .andExpect(status().isOk());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
        Product testProduct = productList.get(productList.size() - 1);
        assertThat(testProduct.getSku()).isEqualTo(UPDATED_SKU);
        assertThat(testProduct.getUpc()).isEqualTo(UPDATED_UPC);
        assertThat(testProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProduct.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProduct.getPrice()).isEqualByComparingTo(UPDATED_PRICE);
        assertThat(testProduct.getProductSize()).isEqualTo(UPDATED_PRODUCT_SIZE);
        assertThat(testProduct.getColors()).isEqualTo(UPDATED_COLORS);
        assertThat(testProduct.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testProduct.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testProduct.getImageSha1()).isEqualTo(UPDATED_IMAGE_SHA_1);
        assertThat(testProduct.getImageCdnUrl()).isEqualTo(UPDATED_IMAGE_CDN_URL);
        assertThat(testProduct.getThumbnailSha1()).isEqualTo(UPDATED_THUMBNAIL_SHA_1);
        assertThat(testProduct.getThumbnailCdnUrl()).isEqualTo(UPDATED_THUMBNAIL_CDN_URL);
    }

    @Test
    @Transactional
    void patchNonExistingProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();
        product.setId(count.incrementAndGet());

        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();
        product.setId(count.incrementAndGet());

        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();
        product.setId(count.incrementAndGet());

        // Create the Product
        ProductDTO productDTO = productMapper.toDto(product);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProduct() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        int databaseSizeBeforeDelete = productRepository.findAll().size();

        // Delete the product
        restProductMockMvc
            .perform(delete(ENTITY_API_URL_ID, product.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
