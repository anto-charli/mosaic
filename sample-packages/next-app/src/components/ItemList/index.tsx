
import React, { useEffect, useState } from 'react';
import { Badge, Box, Image, Container } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

function ItemList() {

    const [items, setItems] = React.useState([]);

    const getItems = async () => {
        let response = await fetch('https://fakestoreapi.com/products')
        response = await response.json() || []
        setItems(response)
    }

    useEffect(() => {
        getItems()
    }, [])

    return (
        <Container maxW='container.xl' display='flex' alignItems="center" flexWrap="wrap" justifyContent="space-around">
            {
                items.length > 0 && items.map((item,idx) => {   
                    return <Item key={`item-${idx}`} item={item}/>
                })
            }
        </Container>
    )
}

function Item(props) {
    const { item = {} } = props
    const property = {
        imageUrl: item?.image,
        imageAlt: item?.title,
        beds: 3,
        baths: 2,
        title: item?.title,
        formattedPrice: `$${item?.price}`,
        reviewCount: item?.rating?.count,
        rating: item?.rating?.rate,
      }

    const [isAddedToBag, setAddToBag] = useState(false)

    const addToBag = () => {
      setAddToBag(true)
    }

    return (
    <Box maxW='sm' w='250px' borderWidth='1px' borderRadius='lg' margin="8px">
        <Image src={property.imageUrl} alt={property.imageAlt} h="200px" objectPosition="center" objectFit="contain" marginLeft="auto" marginRight="auto"/>
  
        <Box p='6'>
          <Box display='flex' alignItems='baseline'>
            <Badge borderRadius='full' px='2' colorScheme='teal'>
              New
            </Badge>
            <Box
              color='gray.500'
              fontWeight='semibold'
              letterSpacing='wide'
              fontSize='xs'
              textTransform='uppercase'
              ml='2'
            >
              {property.beds} beds &bull; {property.baths} baths
            </Box>
          </Box>
  
          <Box
            mt='1'
            fontWeight='semibold'
            as='h4'
            lineHeight='tight'
            noOfLines={1}
          >
            {property.title}
          </Box>
  
          <Box>
            {property.formattedPrice}
            <Box as='span' color='gray.600' fontSize='sm'>
              / wk
            </Box>
          </Box>
  
          <Box display='flex' mt='2' alignItems='center'>
            {Array(5)
              .fill('')
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < property.rating ? 'teal.500' : 'gray.300'}
                />
              ))}
            <Box as='span' ml='2' color='gray.600' fontSize='sm'>
              {property.reviewCount} reviews
            </Box>
          </Box>
          <Box as='button' borderRadius='md' bg='tomato' color='white' px={4} h={9} marginTop='10px' onClick={addToBag}>
            {isAddedToBag ? 'Added to Bag' : 'Add to Bag'}
          </Box>
        </Box>
      </Box>
    )
}

export default ItemList
export { ItemList }
