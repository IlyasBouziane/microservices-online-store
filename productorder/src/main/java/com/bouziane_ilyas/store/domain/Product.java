package com.bouziane_ilyas.store.domain;

import com.bouziane_ilyas.store.domain.enumeration.ProductSize;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Product sold by the Online store
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "sku", nullable = false)
    private String sku;

    @NotNull
    @Column(name = "upc", nullable = false)
    private String upc;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "product_size", nullable = false)
    private ProductSize productSize;

    @Pattern(regexp = "^([a-z]+,)*[a-z]+$")
    @Column(name = "colors")
    private String colors;

    /**
     * For uploading the image
     */
    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    /**
     * For caching with HTTP header Etag and If-None-Match
     */
    @Size(min = 40, max = 40)
    @Pattern(regexp = "[a-f0-9]{40}")
    @Column(name = "image_sha_1", length = 40)
    private String imageSha1;

    /**
     * For the content delivery network
     */
    @Column(name = "image_cdn_url")
    private String imageCdnUrl;

    /**
     * For caching with HTTP header Etag and If-None-Match
     */
    @Size(min = 40, max = 40)
    @Pattern(regexp = "[a-f0-9]{40}")
    @Column(name = "thumbnail_sha_1", length = 40)
    private String thumbnailSha1;

    /**
     * For the content delivery network
     */
    @Column(name = "thumbnail_cdn_url")
    private String thumbnailCdnUrl;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private ProductCategory productCategory;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return this.sku;
    }

    public Product sku(String sku) {
        this.setSku(sku);
        return this;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getUpc() {
        return this.upc;
    }

    public Product upc(String upc) {
        this.setUpc(upc);
        return this;
    }

    public void setUpc(String upc) {
        this.upc = upc;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Product description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Product price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public ProductSize getProductSize() {
        return this.productSize;
    }

    public Product productSize(ProductSize productSize) {
        this.setProductSize(productSize);
        return this;
    }

    public void setProductSize(ProductSize productSize) {
        this.productSize = productSize;
    }

    public String getColors() {
        return this.colors;
    }

    public Product colors(String colors) {
        this.setColors(colors);
        return this;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Product image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Product imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getImageSha1() {
        return this.imageSha1;
    }

    public Product imageSha1(String imageSha1) {
        this.setImageSha1(imageSha1);
        return this;
    }

    public void setImageSha1(String imageSha1) {
        this.imageSha1 = imageSha1;
    }

    public String getImageCdnUrl() {
        return this.imageCdnUrl;
    }

    public Product imageCdnUrl(String imageCdnUrl) {
        this.setImageCdnUrl(imageCdnUrl);
        return this;
    }

    public void setImageCdnUrl(String imageCdnUrl) {
        this.imageCdnUrl = imageCdnUrl;
    }

    public String getThumbnailSha1() {
        return this.thumbnailSha1;
    }

    public Product thumbnailSha1(String thumbnailSha1) {
        this.setThumbnailSha1(thumbnailSha1);
        return this;
    }

    public void setThumbnailSha1(String thumbnailSha1) {
        this.thumbnailSha1 = thumbnailSha1;
    }

    public String getThumbnailCdnUrl() {
        return this.thumbnailCdnUrl;
    }

    public Product thumbnailCdnUrl(String thumbnailCdnUrl) {
        this.setThumbnailCdnUrl(thumbnailCdnUrl);
        return this;
    }

    public void setThumbnailCdnUrl(String thumbnailCdnUrl) {
        this.thumbnailCdnUrl = thumbnailCdnUrl;
    }

    public ProductCategory getProductCategory() {
        return this.productCategory;
    }

    public void setProductCategory(ProductCategory productCategory) {
        this.productCategory = productCategory;
    }

    public Product productCategory(ProductCategory productCategory) {
        this.setProductCategory(productCategory);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", sku='" + getSku() + "'" +
            ", upc='" + getUpc() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", price=" + getPrice() +
            ", productSize='" + getProductSize() + "'" +
            ", colors='" + getColors() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", imageSha1='" + getImageSha1() + "'" +
            ", imageCdnUrl='" + getImageCdnUrl() + "'" +
            ", thumbnailSha1='" + getThumbnailSha1() + "'" +
            ", thumbnailCdnUrl='" + getThumbnailCdnUrl() + "'" +
            "}";
    }
}
