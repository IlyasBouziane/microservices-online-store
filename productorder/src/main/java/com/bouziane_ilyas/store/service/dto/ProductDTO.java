package com.bouziane_ilyas.store.service.dto;

import com.bouziane_ilyas.store.domain.enumeration.ProductSize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.bouziane_ilyas.store.domain.Product} entity.
 */
@ApiModel(description = "Product sold by the Online store")
public class ProductDTO implements Serializable {

    private Long id;

    @NotNull
    private String sku;

    @NotNull
    private String upc;

    @NotNull
    private String name;

    @Lob
    private String description;

    @NotNull
    @DecimalMin(value = "0")
    private BigDecimal price;

    @NotNull
    private ProductSize productSize;

    @Pattern(regexp = "^([a-z]+,)*[a-z]+$")
    private String colors;

    /**
     * For uploading the image
     */

    @ApiModelProperty(value = "For uploading the image")
    @Lob
    private byte[] image;

    private String imageContentType;

    /**
     * For caching with HTTP header Etag and If-None-Match
     */
    @Size(min = 40, max = 40)
    @Pattern(regexp = "[a-f0-9]{40}")
    @ApiModelProperty(value = "For caching with HTTP header Etag and If-None-Match")
    private String imageSha1;

    /**
     * For the content delivery network
     */
    @ApiModelProperty(value = "For the content delivery network")
    private String imageCdnUrl;

    /**
     * For caching with HTTP header Etag and If-None-Match
     */
    @Size(min = 40, max = 40)
    @Pattern(regexp = "[a-f0-9]{40}")
    @ApiModelProperty(value = "For caching with HTTP header Etag and If-None-Match")
    private String thumbnailSha1;

    /**
     * For the content delivery network
     */
    @ApiModelProperty(value = "For the content delivery network")
    private String thumbnailCdnUrl;

    private ProductCategoryDTO productCategory;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getUpc() {
        return upc;
    }

    public void setUpc(String upc) {
        this.upc = upc;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public ProductSize getProductSize() {
        return productSize;
    }

    public void setProductSize(ProductSize productSize) {
        this.productSize = productSize;
    }

    public String getColors() {
        return colors;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getImageSha1() {
        return imageSha1;
    }

    public void setImageSha1(String imageSha1) {
        this.imageSha1 = imageSha1;
    }

    public String getImageCdnUrl() {
        return imageCdnUrl;
    }

    public void setImageCdnUrl(String imageCdnUrl) {
        this.imageCdnUrl = imageCdnUrl;
    }

    public String getThumbnailSha1() {
        return thumbnailSha1;
    }

    public void setThumbnailSha1(String thumbnailSha1) {
        this.thumbnailSha1 = thumbnailSha1;
    }

    public String getThumbnailCdnUrl() {
        return thumbnailCdnUrl;
    }

    public void setThumbnailCdnUrl(String thumbnailCdnUrl) {
        this.thumbnailCdnUrl = thumbnailCdnUrl;
    }

    public ProductCategoryDTO getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(ProductCategoryDTO productCategory) {
        this.productCategory = productCategory;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductDTO)) {
            return false;
        }

        ProductDTO productDTO = (ProductDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductDTO{" +
            "id=" + getId() +
            ", sku='" + getSku() + "'" +
            ", upc='" + getUpc() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", price=" + getPrice() +
            ", productSize='" + getProductSize() + "'" +
            ", colors='" + getColors() + "'" +
            ", image='" + getImage() + "'" +
            ", imageSha1='" + getImageSha1() + "'" +
            ", imageCdnUrl='" + getImageCdnUrl() + "'" +
            ", thumbnailSha1='" + getThumbnailSha1() + "'" +
            ", thumbnailCdnUrl='" + getThumbnailCdnUrl() + "'" +
            ", productCategory=" + getProductCategory() +
            "}";
    }
}
