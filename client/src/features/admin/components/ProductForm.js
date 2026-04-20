import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedProduct,
  createProductAsync,
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
} from '../../product/productSlice';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import Modal from '../../common/Modal';
import { toast } from 'react-toastify';

function ProductForm() {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedThumbnail = watch('thumbnailFile');
  const selectedGalleryImages = watch('imageFiles');

  const colors = [
    {
      name: 'Black',
      class: 'bg-black',
      selectedClass: 'ring-black',
      id: 'black',
    },
    {
      name: 'White',
      class: 'bg-white',
      selectedClass: 'ring-gray-400',
      id: 'white',
    },
    {
      name: 'Gray',
      class: 'bg-gray-400',
      selectedClass: 'ring-gray-500',
      id: 'gray',
    },
    {
      name: 'Silver',
      class: 'bg-gray-300',
      selectedClass: 'ring-gray-400',
      id: 'silver',
    },
    {
      name: 'Gold',
      class: 'bg-yellow-400',
      selectedClass: 'ring-yellow-500',
      id: 'gold',
    },
    {
      name: 'Rose Gold',
      class: 'bg-rose-300',
      selectedClass: 'ring-rose-400',
      id: 'rose-gold',
    },
    {
      name: 'Blue',
      class: 'bg-blue-500',
      selectedClass: 'ring-blue-600',
      id: 'blue',
    },
    {
      name: 'Navy Blue',
      class: 'bg-blue-900',
      selectedClass: 'ring-blue-900',
      id: 'navy-blue',
    },
    {
      name: 'Green',
      class: 'bg-green-500',
      selectedClass: 'ring-green-600',
      id: 'green',
    },
    {
      name: 'Mint Green',
      class: 'bg-green-300',
      selectedClass: 'ring-green-400',
      id: 'mint-green',
    },
    {
      name: 'Purple',
      class: 'bg-purple-500',
      selectedClass: 'ring-purple-600',
      id: 'purple',
    },
    {
      name: 'Red',
      class: 'bg-red-500',
      selectedClass: 'ring-red-600',
      id: 'red',
    },
  ];

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue('title', selectedProduct.title);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage);
      setValue('stock', selectedProduct.stock);
      setValue('brand', selectedProduct.brand);
      setValue('category', selectedProduct.category);
      setValue('highlight1', selectedProduct.highlights?.[0] || '');
      setValue('highlight2', selectedProduct.highlights?.[1] || '');
      setValue('highlight3', selectedProduct.highlights?.[2] || '');
      setValue('highlight4', selectedProduct.highlights?.[3] || '');
      setValue(
        'colors',
        selectedProduct.colors?.map((color) => color.id) || []
      );
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      setIsSaving(true);
      await dispatch(
        updateProductAsync({
          ...selectedProduct,
          deleted: true,
          existingThumbnail: selectedProduct.thumbnail,
          existingThumbnailPublicId: selectedProduct.thumbnailPublicId,
          existingImages: selectedProduct.images || [],
          existingImagePublicIds: selectedProduct.imagePublicIds || [],
          imageFiles: [],
        })
      ).unwrap();
      toast.success('Product deleted');
      setOpenModal(null);
    } catch (error) {
      toast.error(error.message || 'Unable to delete product');
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data) => {
    const thumbnailFile = data.thumbnailFile?.[0];
    const galleryFiles = Array.from(data.imageFiles || []);

    if (!params.id && !thumbnailFile) {
      toast.error('Upload a thumbnail image');
      return;
    }

    if (!params.id && !galleryFiles.length) {
      toast.error('Upload at least one gallery image');
      return;
    }

    if (galleryFiles.length > 3) {
      toast.error('You can upload up to 3 gallery images');
      return;
    }

    const product = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      brand: data.brand?.trim(),
      category: data.category?.trim(),
      price: +data.price,
      stock: +data.stock,
      discountPercentage: Number(data.discountPercentage || 0),
      rating: params.id ? selectedProduct?.rating || 0 : 0,
      highlights: [
        data.highlight1,
        data.highlight2,
        data.highlight3,
        data.highlight4,
      ]
        .map((highlight) => highlight?.trim())
        .filter(Boolean),
      colors: []
        .concat(data.colors || [])
        .map((colorId) =>
        colors.find((color) => color.id === colorId)
        )
        .filter(Boolean),
      sizes: [],
      deleted: params.id ? selectedProduct?.deleted || false : false,
      thumbnailFile,
      imageFiles: galleryFiles,
      existingThumbnail: selectedProduct?.thumbnail || '',
      existingThumbnailPublicId: selectedProduct?.thumbnailPublicId || '',
      existingImages: selectedProduct?.images || [],
      existingImagePublicIds: selectedProduct?.imagePublicIds || [],
    };

    try {
      setIsSaving(true);

      if (params.id) {
        await dispatch(
          updateProductAsync({
            ...product,
            id: params.id,
          })
        ).unwrap();
        toast.success('Product updated');
      } else {
        await dispatch(createProductAsync(product)).unwrap();
        toast.success('Product created');
        reset();
      }
    } catch (error) {
      toast.error(error.message || 'Unable to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const currentImages = [
    selectedProduct?.thumbnail,
    ...(selectedProduct?.images || []),
  ].filter(Boolean);

  const selectedImageNames = Array.from(selectedGalleryImages || []).map(
    (file) => file.name
  );

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {params.id ? 'Edit Product' : 'Add Product'}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {selectedProduct && selectedProduct.deleted && (
                <h2 className="text-red-500 sm:col-span-6">
                  This product is deleted
                </h2>
              )}

              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register('title', {
                        required: 'name is required',
                      })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register('description', {
                      required: 'description is required',
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue=""
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brand
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      id="brand"
                      list="brand-suggestions"
                      placeholder="Type a brand name"
                      {...register('brand', {
                        required: 'brand is required',
                      })}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <datalist id="brand-suggestions">
                    {brands.map((brand) => (
                      <option key={brand.value} value={brand.value} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="colors"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Colors
                </label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <Fragment key={color.id}>
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          {...register('colors')}
                          value={color.id}
                        />
                        {color.name}
                      </label>
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      id="category"
                      list="category-suggestions"
                      placeholder="Type a category name"
                      {...register('category', {
                        required: 'category is required',
                      })}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <datalist id="category-suggestions">
                    {categories.map((category) => (
                      <option key={category.value} value={category.value} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register('price', {
                        required: 'price is required',
                        min: 1,
                        max: 1000000,
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register('discountPercentage', {
                        min: 0,
                        max: 99,
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register('stock', {
                        required: 'stock is required',
                        min: 0,
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {currentImages.length > 0 && (
                <div className="sm:col-span-6">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Current Images
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {currentImages.map((imageUrl, index) => (
                      <img
                        key={`${imageUrl}-${index}`}
                        src={imageUrl}
                        alt={`Current product ${index + 1}`}
                        className="h-32 w-full rounded-md object-cover shadow-sm ring-1 ring-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="sm:col-span-6">
                <label
                  htmlFor="thumbnailFile"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Thumbnail Image
                </label>
                <div className="mt-2">
                  <input
                    id="thumbnailFile"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    {...register('thumbnailFile')}
                    className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-indigo-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {params.id
                    ? 'Leave this empty to keep the current thumbnail.'
                    : 'Upload the main cover image for the product.'}
                </p>
                {selectedThumbnail?.[0] && (
                  <p className="mt-1 text-sm text-gray-500">
                    Selected: {selectedThumbnail[0].name}
                  </p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="imageFiles"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Gallery Images
                </label>
                <div className="mt-2">
                  <input
                    id="imageFiles"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    {...register('imageFiles')}
                    className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-indigo-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Upload up to 3 extra product images. Leave empty while editing
                  to keep the current gallery.
                </p>
                {selectedImageNames.length > 0 && (
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    {selectedImageNames.map((fileName) => (
                      <p key={fileName}>{fileName}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 1
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register('highlight1')}
                      id="highlight1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 2
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register('highlight2')}
                      id="highlight2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight3"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 3
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register('highlight3')}
                      id="highlight3"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight4"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 4
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register('highlight4')}
                      id="highlight4"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {selectedProduct && !selectedProduct.deleted && (
            <button
              onClick={(event) => {
                event.preventDefault();
                setOpenModal(true);
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={isSaving}
            >
              Delete
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
      {selectedProduct && (
        <Modal
          title={`Delete ${selectedProduct.title}`}
          message="Are you sure you want to delete this Product ?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleDelete}
          cancelAction={() => setOpenModal(null)}
          showModal={openModal}
        ></Modal>
      )}
    </>
  );
}

export default ProductForm;
