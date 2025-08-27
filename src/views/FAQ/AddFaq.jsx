import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { Editor } from "../../components/Inputs/Editor";
import { Grid2 } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { loader, toast } from "../../utils";

import { createFaq, getFaqById, updateFaq } from "../../store/apiSlices/FaqApiSlice";

export const AddFaq = ({ mode }) => {
  const isAddMode = mode === "add";
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: "",
      answer: "",
 
    },
  });
  useEffect(() => {
    if (isLoading) {
      loader.start();
    } else {
      loader.stop();
    }
  }, [isLoading]);
  useEffect(() => {
    const fetchPackage = async () => {
      if (!isAddMode && id) {
        try {
          setIsLoading(true);
          const response = await getFaqById(id);
          const data = response.data?.data; // Access nested `data`
          if (data) {
            setValue("question", data.question || "");
            setValue("answer", data.answer || "");
          
          }
        } catch (err) {
          toast.error("Failed to load FAQ.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPackage();
  }, [id, isAddMode, setValue]);

  const onSubmit = async (formData) => {
    const payload = {
      question: formData.question,
       answer: formData.answer,

    };

    try {
      loader.start();
      if (isAddMode) {
        await createFaq(payload);
        toast.success("FAQ created successfully");
      } else {
        await updateFaq(id, payload);
        toast.success("FAQ updated successfully");
      }
      navigate("/faq");
    } catch (error) {
      toast.error("An error occurred while saving the FAQ.");
    } finally {
      loader.stop();
    }
  };

  const onCancel = () => navigate("/faq");

  return (
    <>
      <div className="font-bold mb-3">
        {isAddMode ? "Add" : "Update"} Frequently Asked Question
      </div>
      <div className="bg-white p-[30px] card rounded-xl shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="question"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  required
                  label="Question"
                  placeholder="write question..."
                  error={!!errors.question}
                  {...field}
                />
              )}
            />
          </div>

          {/* <div className="mt-3">
            <Controller
              name="answer"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    label="Answer"
                    textarea
                    placeholder="write  answer.."
                    error={!!errors.answer}
                    required
                    rows={5}
                  />
 
                </div>
              )}
            />
          </div> */}
            <div className="mt-3">
                      <Controller
                        name="answer"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Answer<span className="text-red-600 text-xl">*</span>
                            </label>
                            <Editor
                              value={field.value}
                              onChange={field.onChange}
                              height={200}
                              placeholder="write a answer.."
                            />
                            {errors.answer && (
                              <p className="text-red-500 text-sm mt-1">
                                This field is required.
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
            <Button primary type="submit">
              {isAddMode ? "Save" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
